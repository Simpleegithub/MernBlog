const express=require('express');
const PostController=require('../controllers/Postcontroller');
const verifyToken = require('../utils/VerifyUser');

const router=express.Router();


router.post('/create',verifyToken,PostController.create);

module.exports= router;