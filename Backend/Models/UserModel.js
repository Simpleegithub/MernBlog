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
        default:"https://lh3.googleusercontent.com/a/ACg8ocJfzN-vFtuSm444JCbRM0jMSHc24bVl4jvVkZnUq1O9VPm5YE4l=s96-c"
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const User=mongoose.model('User',UserSchema);

module.exports = User;