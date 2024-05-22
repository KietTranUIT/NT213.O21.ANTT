const express = require("express");
const app = express();
const mongoose = require("mongoose");


require('dotenv').config();
const Port = process.env.PORT || 5000;

// Kết nối đến mongodb
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
    console.log('Connect to mongodb successfully!');
    })
    .catch((error) => {
    console.error('Connect to mongodb failed!', error);
    });

// Server lắng nghe trên cổng 3000 hoặc cổng 5000
app.listen(Port, () => {
    console.log(`Server is running on ${Port}`);
});