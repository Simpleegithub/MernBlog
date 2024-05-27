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


exports.getComment=async(req,res,next)=>{

    try{
    const comments=await Comment.find({postId:req.params.postId}).sort({createdAt:-1});
    console.log(comments)

    res.status(200).json(comments)


    } catch(error){
        next(error)
    }
}

exports.likeComment=async(req,res,next)=>{
try{
    const comment=await Comment.findById(req.params.commentId);
    if(!comment){
        return next(ErrorHandler(404,'Comment Not Found'))
    }

    const userIndex=comment.likes.indexOf(req.user.id);
    if(userIndex==-1){
        comment.numberOflikes+=1,
        comment.likes.push(req.user.id);
    } else{
        comment.numberOflikes-=1,
        comment.likes.splice(userIndex,1);
    }
    await comment.save()
    res.status(200).json(comment)

} catch(error){

}
}


exports.editComment=async(req,res,next)=>{
    try{
        const comment=await Comment.findById(req.params.commentId);

        if(!comment){
            return next(ErrorHandler(404,'Comment not found'))
        }

        if(comment.userId !==req.user.id || !req.user.isAdmin){
            return next(ErrorHandler(403,'You are not allowed to Edit this comment'))
        }

        const editedComment= await Comment.findByIdAndUpdate(req.params.commentId,{
            content:req.body.content
        },{new:true})

        res.status(200).json({editedComment})

    } catch(error){
     next(error)
    }
}


exports.deleteComment=async(req,res,next)=>{

    try{
        const comment=await Comment.findById(req.params.commentId);

        if(!comment){
            return next(ErrorHandler(404,'Comment not found'))
        }

        if(comment.userId !==req.user.id || !req.user.isAdmin){
            return next(ErrorHandler(403,'You are not allowed to Delete this comment'))
        }

        await Comment.findByIdAndDelete(req.params.commentId);

        res.status(200).json({
            message:"Comment has been Deleted"
        })


    } catch(error){
        console.log(error)
    }
}