const express=require('express');
const UserController=require('../controllers/userController');
const verifyToken  = require('../utils/VerifyUser');
const router=express.Router();

router.get('/:id',UserController.getSingleUser);
router.post('/update/:id',verifyToken,UserController.updateUser)


module.exports = router;