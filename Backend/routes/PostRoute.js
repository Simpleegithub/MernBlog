const express=require('express');
const PostController=require('../controllers/Postcontroller');
const verifyToken = require('../utils/VerifyUser');

const router=express.Router();


router.post('/create',verifyToken,PostController.create);
router.get('/getposts',PostController.getposts);
router.delete('/delete/:id',verifyToken,PostController.deletePost)

module.exports= router;