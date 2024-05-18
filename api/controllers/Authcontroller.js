const User = require('../Models/UserModel');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return res.status(400).json({
            message: "All Fields are required"
        });
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
        res.status(500).json({
            message: err.message || "Internal Server Error"
        });
    }
}
