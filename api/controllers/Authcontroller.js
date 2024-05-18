const User = require('../Models/UserModel');
const bcrypt = require('bcryptjs');
const { ErrorHandler } = require('../utils/Error');

exports.signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
       
        return next(ErrorHandler(400,'All Fields are required'))
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
        const newUser = await User.create({
            username: username,
            email: email,
            password: hashedPassword
        });
        
        res.status(201).json({
            message: "success",
            newUser
        });
    } catch (err) {
       next(err);
    }
}
