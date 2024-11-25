const cron = require('node-cron');
const Event = require('./models/Event/eventManage.schema');
const sendMail = require('./utils/sendMail');
const rsvp = require('./models/RSVP/rsvp.Schema');
const User = require('./models/Auth/user.schema');
cron.schedule('0 0 * * *', async() => { // Runs every hour
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    let data = await Event.find()
    console.log("Event",data[0].title)
    const upcomingEvents = await Event.find({
        date: { $gte: now, $lt: next24Hours },
      });
    for (const event of upcomingEvents) {
        const RSVP = await rsvp.find({ eventId: event._id });
        for (const rsvpEntry of RSVP) {
            let dataUser = await User.findById({_id:rsvpEntry.userId})
            let EventName = await Event.findById({_id:rsvpEntry.eventId})
            console.log("EventName",EventName)
            sendMail(dataUser.email,`Reminder: ${EventName.title}`,`Hello, just a reminder that the event "${EventName.title}" is happening on ${EventName.date.toUTCString()}.`)
        }
    } 
});