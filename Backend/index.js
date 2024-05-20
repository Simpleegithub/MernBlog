const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const UserRoutes=require('./routes/UserRoute');
const AuthRoutes=require('./routes/AuthRoute');
const cookieParser=require('cookie-parser')
// require('dotenv').config();
const DB = process.env.DATABASE.replace("<password>", "Choa%40992");

console.log(DB);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

app.use(express.json());
app.use(cookieParser())




// routes
app.use('/api/user',UserRoutes);

app.use('/api/auth',AuthRoutes);





//global Error handler Middle ware

app.use((err,req,res,next)=>{
  const statusCode=err.statusCode||500;
  const message=err.message||'Internal server error';

  res.status(statusCode).json({
    success:false,
    statusCode,
    message

  })
})





app.listen(process.env.PORT, (req, res) => {
  console.log("App is listening on Port 3000");
});



