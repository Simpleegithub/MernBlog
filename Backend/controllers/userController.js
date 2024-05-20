const User = require('../Models/UserModel');
const { ErrorHandler } = require('../utils/Error');
const bcrypt =require('bcryptjs')

exports.getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json({
            message: "success",
            user
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message || err.toString(),
        });
    }
}


exports.updateUser=async(req,res,next)=>{
    console.log(req.user);
    if(req.user.id!==req.params.id){
    return next(ErrorHandler(403,'You are not allowed to update this user'))
    }

    if(req.body.password){
        if(!req.body.password.length<6){
         return next(ErrorHandler(400,'Password must be atleast 8 characters'))
        }
        req.body.password=bcrypt.hashSync(req.body.password,10);
    }

    

    if(req.body.username){
        if(req.body.username.length<7 || req.body.username>20){
            return next(ErrorHandler(400,'Username must be between 7 and 20 characters'))
        }

        if(req.body.username.includes(' ')){
            return next(ErrorHandler(400,'Username cannot contain spaces'))
        }

        if(req.body.username!==req.body.username.toLowerCase()){
            return next(ErrorHandler(400,'Username must be lowerCase'))
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(ErrorHandler(400,'Username must contains letters and numbers'))

        }
    }


    try{
    const updatedUser=await User.findByIdAndUpdate(req.params.id,{
       
            username:req.body.username,
            email:req.body.email,
            profilePicture:req.body.profilePicture,
            password:req.body.password
        
    
    },{new:true})
    updatedUser.password=undefined;
    res.status(200).json({
        message:"successfully updated",
        updatedUser
    })

    }catch(error){
        next(error)
    }

}
