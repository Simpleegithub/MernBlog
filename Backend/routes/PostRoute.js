const express=require('express');
const PostController=require('../controllers/Postcontroller');
const verifyToken = require('../utils/VerifyUser');

const router=express.Router();


router.post('/create',verifyToken,PostController.create);
router.get('/getposts',PostController.getposts)

module.exports= router;