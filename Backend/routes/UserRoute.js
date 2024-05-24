const express = require('express');
const UserController = require('../controllers/userController');
const verifyToken = require('../utils/VerifyUser');
const router = express.Router();

// Specific routes before dynamic parameter routes
router.get('/getusers', verifyToken, UserController.getUsers);
router.post('/signout', UserController.signOut);

// Routes with dynamic parameter
router.get('/:id', UserController.getSingleUser);
router.post('/update/:id', verifyToken, UserController.updateUser);
router.delete('/delete/:id', verifyToken, UserController.deleteUser);

module.exports = router;
