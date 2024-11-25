const mongoose = require('mongoose')
const rsvpSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, ref:'User', required:true
    },
    eventId:{
        type:mongoose.Schema.Types.ObjectId, ref:'Event', required:true
    },
    status: {
        type: String,
        enum: ['attending', 'not attending', 'maybe'],
        required: true,
    },
    responseDate: {
        type: Date,
        default: Date.now
    },
    member:{
        type:Number,
        default:0
    }
})

const rsvp = mongoose.model('rsvp',rsvpSchema);

module.exports = rsvp