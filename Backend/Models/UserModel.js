const mongoose =require('mongoose');

const UserSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkmx32A0fHBU7IiRKHsEM7xG6KHizAIpdfMA&usqp=CAU"
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const User=mongoose.model('User',UserSchema);

module.exports = User;