Meteor.methods({
  createGathering(formValues, imageUrl) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('Not allowed!');
    }

    check(formValues.title, String);
    check(formValues.shortDescription, String);
    check(formValues.longDescription, String);
    check(formValues.room, String);
    check(formValues.capacity, Number);
    check(formValues.duration, Number);
    check(formValues.datePicker, String);
    check(formValues.timePickerStart, String);
    check(formValues.timePickerEnd, String);
    check(formValues.isRSVPrequired, Boolean);
    check(imageUrl, String);

    try {
      const add = Gatherings.insert({
        authorId: user._id,
        attendees: [],
        authorName: user.username,
        title: formValues.title,
        shortDescription: formValues.shortDescription,
        longDescription: formValues.longDescription,
        room: formValues.room,
        capacity: formValues.capacity,
        phoneNumber: formValues.phoneNumber,
        isRSVPrequired: formValues.isRSVPrequired,
        startDate: formValues.datePicker,
        endDate: formValues.datePicker,
        startTime: formValues.timePickerStart,
        endTime: formValues.timePickerEnd,
        duration: formValues.duration,
        imageUrl: imageUrl,
        isSentForReview: true,
        isPublished: true,
        creationDate: new Date()
      });
      return add;
    } catch (e) {
      throw new Meteor.Error(e, "Couldn't add to Collection");
    }
  },

  publishGathering(gatheringId) {
    const user = Meteor.user();
    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    check(gatheringId, String);

    if (user.isSuperAdmin) {
      try {
        const update = Gatherings.update(gatheringId, {
          $set: {
            isPublished: true,
            publishDate: new Date(),
            publishedBy: user._id
          }
        });
        return update;
      } catch (e) {
        throw new Meteor.Error(e, "Couldn't publish the happening");
      }
    }
  },

  registerAttendanceX(gatheringId) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('Not allowed!');
    } else {
      check(gatheringId, String);
      const currentUser = Meteor.user();
      const theGathering = Gatherings.findOne(gatheringId);
      if (
        !theGathering.attendees ||
        theGathering.capacity > theGathering.attendees.length
      ) {
        try {
          Gatherings.update(gatheringId, {
            $addToSet: {
              attendees: {
                userId: currentUser._id,
                userInfo: currentUser.profile,
                date: new Date()
              }
            }
          });
          try {
            Meteor.users.update(currentUser._id, {
              $addToSet: {
                attending: {
                  gatheringId: theGathering._id,
                  gatheringTitle: theGathering.title,
                  gatheringAuthorName: theGathering.authorName,
                  gatheringAuthorId: theGathering.authorId
                }
              }
            });
            return true;
          } catch (err) {
            throw new Meteor.Error(err, "Couldn't update the Collection");
          }
        } catch (err) {
          console.log(err);
          throw new Meteor.Error(err, "Couldn't update the Collection");
        }
      } else {
        throw new Meteor.Error('Sorry the capacity is full');
      }
    }
  },

  unRegisterAttendanceX(gatheringId) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('Not allowed!');
    } else {
      check(gatheringId, String);
      const currentUser = Meteor.user();
      const theGathering = Gatherings.findOne(gatheringId);
      try {
        Gatherings.update(gatheringId, {
          $pull: {
            attendees: {
              userId: Meteor.userId()
            }
          }
        });
        try {
          Meteor.users.update(currentUser._id, {
            $pull: {
              attending: {
                gatheringId: theGathering._id
              }
            }
          });
        } catch (err) {
          console.log(err);
          throw new Meteor.Error(err, "Couldn't update the Collection");
        }
        return true;
      } catch (err) {
        console.log(err);
        throw new Meteor.Error(err, "Couldn't update the Collection");
      }
    }
  },

  toggleAttendanceAsHost(gatheringId, userId) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('Not allowed!');
    }

    const theGathering = Gatherings.findOne(gatheringId);
    const currentUser = Meteor.user();
    if (theGathering.authorId !== currentUser._id) {
      throw Meteor.Error(err, 'This is not your activity!');
    }

    const attendees = theGathering.attendees;
    try {
      for (let i in attendees) {
        if (attendees[i].userId === userId) {
          if (!attendees[i].didNotAttend) {
            attendees[i].didNotAttend = true;
          } else {
            attendees[i].didNotAttend = false;
          }
        }
      }
      Gatherings.update(gatheringId, {
        $set: {
          attendees: attendees
        }
      });
    } catch (err) {
      console.log(err);
      throw new Meteor.Error(err, "Couldn't toggle attendance");
    }
  },

  addSpace(name) {
    console.log(name, 'me');
    const user = Meteor.user();
    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    let placesCounter = 0;
    Places.find().forEach(place => {
      placesCounter += 1;
    });
    console.log(name, 'xe');
    if (Places.findOne({ name: name })) {
      throw new Meteor.Error('That place already exists!');
    } else {
      try {
        console.log(name, 'ye');
        Places.insert({
          name: name,
          addedBy: Meteor.user().username,
          roomIndex: placesCounter
        });
        return true;
      } catch (err) {
        throw new Meteor.Error(err, "Couldn't add the place : /");
      }
    }
  }
});
