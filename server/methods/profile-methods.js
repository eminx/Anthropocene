import { Meteor } from 'meteor/meteor';

Meteor.methods({
  saveUserInfo(values) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    check(values.firstName, String);
    check(values.lastName, String);
    // check(values.bio, String);

    try {
      Meteor.users.update(user._id, {
        $set: {
          firstName: values.firstName,
          lastName: values.lastName
          // bio: values.bio
        }
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  deleteAccount() {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('You are not a member anyways!');
    }
    try {
      Meteor.users.remove(userId);
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  createWork(newWork) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not a member anyways!');
    }
    try {
      const newWorkId = Works.insert({
        ...newWork,
        authorId: user._id,
        authorUsername: user.username,
        authorFirstName: user.firstName,
        authorLastName: user.lastName
      });
      return newWorkId;
    } catch (e) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  }
});
