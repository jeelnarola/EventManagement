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
            let RSVPData = await rsvp.find()
            let CountData = 0;
            for (const rsvpI of RSVPData) {
                const DataRsvp = await rsvp.find({eventId:rsvpI.eventId})
                CountData = DataRsvp.length;
            }
            if(EventFind.maxMember >= CountData){
                let data = await rsvp.create({
                    userId, eventId,status,member:1
                })
                return res.status(200).json({ msg: 'RSVP Add successfully' , rsvp:data});
            }else{
                return res.status(200).json({ msg: 'RSVP Not Add Because Member Full.'});
            }
        }else if(existingRsvp){
            existingRsvp.status = status;
            await existingRsvp.save()
            sendMail(user.email,`Reminder: ${EventFind.title}`,`Hello, just a reminder that the event "${EventFind.title}" is happening on ${EventFind.date.toUTCString()}.`)
            return res.status(200).json({ msg: 'Already Extis RSVP.'});    
        }
    } catch (error) {
        console.log("Error in rsvp controller", error.message);
        res.status(500).json({success:false,message:"Interna; Server Error"});
    }
}

const EventEdit = async(req,res)=>{
    try {
        let {id} = req.params;
        let {userId} = req.body; 
        let Data= await Event.findOne({_id:id})
        const rsvpData = await rsvp.find({eventId:id});
        if(Data == null ){
            return res.status(404).send({ success: false, message: 'Edit not found or unauthorized' });
        }
        if(Data.createdBy == req.user.id){
            let UpdateData = await Event.findByIdAndUpdate({_id:id,...req.body,createdBy:req.user.id})
            for (const i of rsvpData){
                let user = await User.find({_id:i.userId})
                for(const j in user){
                    sendMail(user[j].email,`Reminder: ${Data.title}`,`Hello, just a reminder that the event "${Data.title}" is happening on ${Data.date.toUTCString()}.`)
                }
            }
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