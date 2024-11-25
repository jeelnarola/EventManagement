const express = require('express');
const cookie = require('cookie-parser');
const {DataBaseConnect} = require('./configs/DataBase');
const AuthRouter = require('./routers/Auth/auth.router');
const EventRouter = require('./routers/Event/event.router');
const eventManage = require('./middlewares/eventmange.middleware');
require('dotenv').config({path:'../.env'});

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));;
app.use(cookie());
app.use('/api/auth',AuthRouter);
app.use('/api/event',eventManage,EventRouter);
require('./schedular')

app.listen(process.env.PORT,()=>{
    console.log("Server Start :-",process.env.PORT);
    DataBaseConnect();
})