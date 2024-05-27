const express=require('express');
const verifyToken=require('../utils/VerifyUser')
const CommentController=require('../controllers/CommentController')

const router=express.Router();

router.post('/create',verifyToken,CommentController.create);
router.get('/getcomments',verifyToken,CommentController.getComments);
router.get('/getPostComments/:postId',CommentController.getComment);
router.post('/likeComment/:commentId',verifyToken,CommentController.likeComment)
router.post('/editComment/:commentId',verifyToken,CommentController.editComment)
router.delete('/deleteComment/:commentId',verifyToken,CommentController.deleteComment)


module.exports=router;