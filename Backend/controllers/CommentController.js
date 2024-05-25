const { ErrorHandler } = require("../utils/Error");
const Comment=require('../Models/CommentsModel')
exports.create=async(req,res,next)=>{

try{
    const {content,userId,postId}=req.body;
    console.log(userId,req.user.id)

    if(userId !==req.user.id){
        return next(ErrorHandler(403,'You are not allowed to create this comment'))
    }

    const newComment=new Comment({
        content,
        postId,
        userId
    })
    await newComment.save();
    res.status(200).json(newComment)

} catch(error){
    next(error)
}

}