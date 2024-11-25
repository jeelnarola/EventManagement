const User = require("../../models/Auth/user.schema");
const Event = require("../../models/Event/eventManage.schema");
const rsvp = require('../../models/RSVP/rsvp.Schema');
const sendMail = require("../../utils/sendMail");


const EventAdd =async(req,res)=>{
    try {
        let {title,description,date,maxMember,EventType} = req.body
        let {street,city,state,postalCode,country,phone,landmark} =req.body.location
        let EventAdd = new Event({
            title,
            description,
            date,
            location:{
                street,
                city,
                state,
                postalCode,
                country,
                phone,
                landmark
            },
            maxMember,
            EventType,
            createdBy:req.user._id
        })

        await EventAdd.save()
        res.status(201).json({success:true,Data:{
            ...EventAdd._doc,
        }})
        
    } catch (error) {
        console.log("Error in EventAdd controller", error.message);
        res.status(500).json({success:false,message:"Interna; Server Error"});
    }
}

const EventShowupcoming = async(req,res)=>{
    try {
        const events = await Event.find().sort({ date: 1 });
        res.send(events)
    } catch (error) {
        console.log("Error in EventShowupcoming controller", error.message);
        res.status(500).json({success:false,message:"Interna; Server Error"});
    }
}

const EventFilter = async(req,res)=>{
    try {
        let {date,location,EventType} = req.query;
        console.log(date,location)
        const filter = {};
        if (date) {
            filter.date = new Date(date);  // If 'date' is provided, filter by date
        }
        if (EventType) {
            filter.EventType = { $regex: EventType }; // Case-insensitive match for EventType
        }
        if (location) {
            filter['location.city'] = { $regex: location, $options: 'i' } // Case-insensitive match for location
        }
        const events = await Event.find(filter).sort({ date: 1 });
        res.status(200).json({ msg: 'Filtered events fetched successfully', Data:events });
       

    } catch (error) {
        console.log("Error in EventFilter controller", error.message);
        res.status(500).json({success:false,message:"Interna; Server Error"});
    }
}

const Eventrsvp = async(req,res)=>{
    try {
        let {userId,eventId,status} = req.body;
        if (!userId || !eventId || !status) {
            return res.status(400).json({ msg: 'Missing required fields' });
        }

        let EventFind = await Event.findById(eventId)
        if (!EventFind) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const existingRsvp = await rsvp.findOne({ userId, eventId });
        if (existingRsvp == null) {
            
            let data = await rsvp.create({
                userId, eventId,status,member:1
            })
            return res.status(200).json({ msg: 'RSVP Add successfully', rsvp: data });
            
        }else if(existingRsvp){
            existingRsvp.status = status;
            await existingRsvp.save()
            sendMail(user.email,`Reminder: ${EventFind.title}`,`Hello, just a reminder that the event "${EventFind.title}" is happening on ${EventFind.date.toUTCString()}.`)
            return res.status(200).json({ msg: 'RSVP updated successfully'});
            
        }
    } catch (error) {
        console.log("Error in rsvp controller", error.message);
        res.status(500).json({success:false,message:"Interna; Server Error"});
    }
}

const EventEdit = async(req,res)=>{
    try {
        let {id} = req.params;
        let Data= await Event.findOne({_id:id})
        if(Data == null ){
            return res.status(404).send({ success: false, message: 'Edit not found or unauthorized' });
        }
        if(Data.createdBy == req.user.id){
            let UpdateData = await Event.findByIdAndUpdate({_id:id,...req.body,createdBy:req.user.id})
            return res.status(201).send({ success: true, message: 'updated successfully' ,UpData :UpdateData});

        }
    } catch (error) {
        console.log("Error in EventEdit controller", error.message);
        res.status(500).json({success:false,message:"Interna; Server Error"});
    }
}


const EventDelete = async(req,res)=>{
    try {
        let {id} = req.params;
        let Data= await Event.findOne({_id:id})
        if(Data == null ){
            return res.status(404).send({ success: false, message: 'Edit not found or unauthorized' });
        }
        if(Data.createdBy == req.user.id){
            let UpdateData = await Event.findByIdAndDelete({_id:id})
            return res.status(201).send({ success: true, message: 'Delete successfully'});
        }
    } catch (error) {
        console.log("Error in EventEdit controller", error.message);
        res.status(500).json({success:false,message:"Interna; Server Error"});
    }
}

module.exports = {EventAdd,EventShowupcoming,EventFilter,Eventrsvp,EventEdit,EventDelete}