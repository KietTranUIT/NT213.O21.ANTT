const express = require("express");
const fileUpload = require("express-fileupload")
const app = express();
const mongoose = require("mongoose");

const userRoutes = require("./routes/user")
const uploadRoutes = require("./routes/upload")


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

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
    fileUpload({
      useTempFiles: true,
    })
);

// Server lắng nghe trên cổng 3000 hoặc cổng 5000
app.listen(Port, () => {
    console.log(`Server is running on ${Port}`);
});


app.use("/", userRoutes);
app.use("/", uploadRoutes);