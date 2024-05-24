const express=require('express');
const PostController=require('../controllers/Postcontroller');
const verifyToken = require('../utils/VerifyUser');

const router=express.Router();


router.post('/create',verifyToken,PostController.create);
router.get('/getposts',PostController.getposts);
router.delete('/delete/:postId/:userId',verifyToken,PostController.deletePost);
router.post('/updatepost/:postId/:userId',verifyToken,PostController.updatePost);





module.exports= router;