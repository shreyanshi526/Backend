const express = require('express');
const connectDB = require('./config/dbconnection');
const errorhandler = require('./middleware/errorhandler');
const dotenv = require('dotenv').config();
connectDB();
const app = express()
const port = process.env.PORT || 5000;

app.use(express.json());   //in built middleware
app.use("/api/users", require("./routes/userRoute"))        
app.use(errorhandler) 

app.listen(port, () => {
    console.log(`server on port ${port}`);
})