const mongoose = require('mongoose');
require('dotenv').config(); 

const db_url = process.env.DB_URL || '';


const connectDB = async() => {
    try{
        await mongoose.connect(db_url).then((data)=>{
            console.log(`database connected with ${data.connection.host}`)
        })
    }catch (error){
        console.log(error.message);
        setTimeout(connectDB,5000);
    }
 }


 module.exports = connectDB;