const getVerifiedEmailText = username => {
  return `Hi ${username},\n\nWe're very happy to inform you that you are now a verified member at Skogen.\n\nThis means that from now on you're welcome to create your own study groups and book spaces & tools either for your own projects or to make a public event. We would like to encourage you to use this tool and wish you to keep a good collaboration with your team.\n\nKind regards,\nSkogen Team`
}

Meteor.methods({
  verifyMember (memberId) {
    const user = Meteor.user()
    if (!user.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed')
    }

    const verifiedUser = Meteor.users.findOne(memberId)

    try {
      Meteor.users.update(memberId, {
        $set: {
          isRegisteredMember: true
        }
      })
      // Meteor.call(
      //   'sendEmail',
      //   memberId,
      //   'You are now a verified member at Skogen',
      //   getVerifiedEmailText(verifiedUser.username)
      // );
    } catch (error) {
      throw new Meteor.Error(error, 'Did not work! :/')
    }
  },

  unVerifyMember (memberId) {
    const user = Meteor.user()
    if (!user.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed')
    }

    const theOtherUser = Meteor.users.findOne(memberId)
    if (theOtherUser.isSuperAdmin) {
      throw new Meteor.Error('You can not unverify a super admin')
    }

    try {
      Meteor.users.update(memberId, {
        $set: {
          isRegisteredMember: false
        }
      })
      Meteor.call(
        'sendEmail',
        memberId,
        'You are removed from Skogen as a verified member',
        `Hi,\n\nWe're sorry to inform you that you're removed as an active member at Skogen. You are, however, still welcome to participate to the events and groups here.\n\n For questions, please contact the admin.\n\nKind regards,\nSkogen Team`
      )
    } catch (error) {
      throw new Meteor.Error(error, 'Did not work! :/')
    }
  }
})
