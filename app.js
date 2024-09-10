const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const UserRoutes=require('./Backend/routes/UserRoute');
const AuthRoutes=require('./Backend/routes/AuthRoute');
const PostRoutes=require('./Backend/routes/PostRoute');
const CommentRoute=require('./Backend/routes/CommentRoute')
const cookieParser=require('cookie-parser')
const path=require('path');
// require('dotenv').config();
const DB = process.env.DATABASE.replace("<password>", "Choa%40992");

// console.log(DB);

// const __dirname = path.resolve();

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

app.use('/api/post',PostRoutes);

app.use('/api/comment',CommentRoute);


 app.use(express.static(path.join(__dirname, '/Client/dist')));
 app.get('*', (req, res) => {
   res.sendFile(path.resolve(__dirname, 'Client', 'dist', 'index.html'));
 });





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


const PORT=process.env.PORT || 8000;


app.listen(PORT, (req, res) => {
  console.log("App is listening on Port 3000");
});



