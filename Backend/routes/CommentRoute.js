const express=require('express');
const verifyToken=require('../utils/VerifyUser')
const CommentController=require('../controllers/CommentController')

const router=express.Router();

router.post('/create',verifyToken,CommentController.create);
router.get('/getPostComments/:postId',CommentController.getComment)


module.exports=router;