# Nodal logs:

## Scenario:
- On the page, she pays, successful payment, we create an account. and we send welcome email with login info, introduction, and a link to the page.
	X- Click create button
	X- Fill the form and submit
	X- get a summary of details entered
	X- You confirm (you get an email)
	- Then admin also gets an email to overview the event
	- Event should only be visible to admins and the creator (isVerified: false)
	- Ability to chat between admins and creator
	- Hanna talks about details with an admin.
	- Then admin confirms, and event goes public 
	- Members who have it on, receive Notifications
	- People can optionally chat with Hanna, or with each other, on a feed that appears on the event-page
	- If Hanna is denied for the event, admin has to enter a short text as a reason that appears by the event.

later	- Chat function to be able to chat with each other; public/private/categories/channels/personal

- One can also create a stream. This is a non-event, it's a concept for people to communicate to each other
 in order to co-create gatherings in the future. This is more of an abstraction and a theme for future
  gatherings to happen. This will also allow chatting scoped for this purpose. It's like groups. But it's
   not based on "people" who form the group, it's based on a "stream"; a theme which people see as a
    purpose to gather for...


## TODOS
### Early todo
X- Implement form validation,
X- Implement creating gathering in the BE
X- Remove insecure package and make it secure
X- Add the Calendar on the homepage 
X- Get the created event data
X- Add duration or ending time to display on the calendar
X- Add the above info to the calendar accordingly
X- Add quick modal view of an event (both for homepage list/calendar and also overview on create)
X- Create routes for dedicated pages for gatherings
X- Fix menu items nice for mobile
X- Add image uploading
X- Admin management: Add you and Hampus isSuperAdmin: true.
X- Fix list view to include the info
X- Make it look OK on mobile

X- Register the event RSVP on the DB: create an array at users object about the events she's attending. The event id, name, maybe some more info. Also add the users id and username to events document on mongo with an array of items: participants: [{user...}]
X- Make sure to pull this as well from the arrays when user unsubscribes
X- Add a feature for the event organiser to confirm who came with a simple tick of participants... 
X- Username, name etc handling: On signup and for other features
X- Test all of this

### Todo as of 12 Mar 2018:
- Implement user profile info entering: full name, personnummer etc
- Add the above details to relevant fields in the db
- Add the part about how to message between creators and super admin, when an activity needs to be edited  
- Hence editing an activity by the creator (update)
- Connecting with Moonclerk 
- Emails for notification (for superadmin and creator)
- Chat... (epic)

### Todo as of May 21:
- Unique username (needed anyways for FB + Google users)
- Implement modal window asking about user info such as personnummer after sign up.
- Implement editing of an activity
- Implement chat for superadmin and activity host to have a dialogue.
- Emails setting.
- Connection with Moonclerk 



