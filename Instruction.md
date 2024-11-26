# Event Management API Project Instructions

### Running the Server
    1. Start the server on PORT 9090. Ensure strict adherence to this port number.
<hr/>

### Project Overview
##### You are tasked with building an API for a Event Management. The project should include the following features.
- Register And Login JWT use and cooike set.
- CRUD operations performed by the User.
- [ TAKE REFERENCE VISIT](https://github.com/jeelnarola/EventManagement/blob/master/Instruction.md)
<hr/>

# Follow these instructions strictly
<hr/>

## Implement in MVC Structure

### Database Connection
<!-- <p style="font-size: 14px;">1. Create a 'config' folder. Inside this folder, create a file named 'db.js'. Write logic to connect to MongoDB using an online database such as MongoDB Atlas.</p> -->
1. Create a 'configs' folder. Inside this folder, create a file named 'DataBase.js'. Write logic to connect to MongoDB using an online database such as MongoDB Atlas.
<hr/>

### Database Schema Design
##### User Schema Design
2. Create a 'models' folder
    1. Inside this folder, create a file named 'user.schema.js' with the following schema:
``` bash
{
  username,
  password,
  email,
  role:'user'
}
```
##### Event Schema Design
1. Create a new file inside the 'models' folder named 'eventManage.schema.js':
``` bash
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
```

##### RSVP Schema Design
1. Create a new file inside the 'models' folder named 'rsvp.Schema.js';
``` bash
{
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
};
```
<hr/>

# Sign Up and Login
### Sign Up - POST route
- Endpoint: Create a POST route at ```/api/auth/register```.
- After a successful login, set cookies in the browser with the user's Token.
- Within the form, provide the following input fields with corresponding IDs:
    - username 
    - password 
    - email 
    - role : Default Set User

### Login - POST route
- Create a POST route named ```/api/auth/login```.
- Within the form, provide the following input fields with corresponding IDs:
    - email
    - password
- After a successful login, set cookies in the browser with the user's Token.

### LogOut - POST route
- Create a POST route named ```/api/auth/logout```.
- After a successful LogOut, Clear cookies in browser.


# Event
## Create a Event Post Form
1. POST Route for Event Creation: Begin by creating a POST route with the path ```/api/event/add```. This route will handle the creation of new Event posts.
2. According Event Schema Data Enter 👍
    - Example :-
    ```
        {
            "title":"ABC2",
            "description":"i am ABCD 22",
            "date":"2024-11-26T10:00:00Z",
            "location":{
                "street":"123 Main St",
                "city":"Springfield",
                "state":"IL",
                "postalCode":"62701",
                "country":"USA",
                "phone":"555-1234",
                "landmark":"Near the central park"
                },
            "maxMember":10,
            "EventType":"corporation",
            "image":[]
        }
    ```
3. make middleware to check User Login.

## GET route - Fetch and Render Upcoming Event Home Page
1. Create a GET route at ```/api/event/```.
2. send a response containing all available event. 

## Filters Event For User
1. Create a GET route at ```/api/event/events```.
2. performed From Query Perameters Like <b>date, location, EventType</b>.
3. Example URL :- localhost:9090/api/event/events?location=cityName&date=Date&EventType=Eventtypename

# RSVP 
## Create a RSVP Post Form :- POST route
- Create A POST route at ```/api/event/rsvp```.
- According Event Schema Data Enter 👍
    - Example :- 
    ```
    {
        "eventId":"Enter eventId",
        "userId":"Enter userId",
        "status":"Enter Stuatus"
    }
    ```
- After a successful RSVP Register, Send Message :- RSVP Add successfully And RSVP Register User Send.
- mange a Event MaxMamber getter than rsvp member send Message :- 'RSVP Not Add Because Member Full.'
 
## Update a RSVP PATCH Form :- PATCH route 
- Create A PATCH route at ``` /api/event/edit/:id```.
- Update Data Send.
- Update Event For All Register RSVP User Send mail.
- make middleware to check Login.

 
## Delete a RSVP :- DELETE route
- Create A DELETE route at ``` api/event/delete/:id```.
- make middleware to check Login.


## Approaching Event Send Mail Message
- 24 hours before Send Mail And Reminder Event.
- Use For ```node-cron```

#
```
## Start The Project
1. First of all git repository Download.
2. Run 'npm i' to install dependencies.
3. run Program to src folder in ' node index.js' 
```

<!-- # Title
<u></u>
## Subtitle
- Bullet Point
**Bold Text**
This is **bold** text, this is <u>underlined</u> text, and this is <strong><u>bold and underlined</u></strong> text.
<p style="color: red; font-size: 18px;">Styled Text</p>
<hr/> -->
