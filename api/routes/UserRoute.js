const express=require('express');
const UserController=require('../controllers/userController')
const router=express.Router();

router.get('/test',UserController.test)


module.exports = router;