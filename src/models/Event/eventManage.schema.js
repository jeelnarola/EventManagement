const mongoose = require('mongoose')

const AddressSchema = mongoose.Schema({
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    landmark: {
        type: String,
        required: false, 
    },
}, { _id: false });

const EventSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    location:AddressSchema,
    maxMember:{
        type:Number,
        require:true
    },
    EventType:{
        type:String,
        require:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId, ref:'User', required:true,
    },
    image:[{
        type: String, // Store image file paths or URLs
        required: true,
    }],
});

const Event = mongoose.model('Event',EventSchema)
module.exports = Event