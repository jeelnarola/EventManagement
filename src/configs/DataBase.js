const mongoose = require('mongoose')
require('dotenv').config()
const DataBaseConnect = async()=>{
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("DataBAse Connect...")
}

module.exports = {DataBaseConnect}