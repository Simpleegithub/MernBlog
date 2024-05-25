const mongoose=require('mongoose')

const CommentSchema=mongoose.Schema({
    content:{
        required:true,
        type:String
    },

    postId:{
        type:String,
        required:true
    },

    userId:{
        type:String,
        required:true
    },
    likes:{
        type:Array,
        default:[]
    },
    numberOflikes:{
        type:Number,
        default:0
    }
},{timestamps:true})

const Comment=mongoose.model('Comment',CommentSchema);

module.exports=Comment