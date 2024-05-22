const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const { ErrorHandler } = require("../utils/Error");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(ErrorHandler(400, "All Fields are required"));
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "success",
      user,
    });
  } catch (err) {
    next(err);
  }
};

exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(ErrorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(ErrorHandler(404, "User not Found"));
    }
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(ErrorHandler(401, "Invalid password"));
    }

    // Remove password from validUser object
    validUser.password = undefined;

    const token = jwt.sign({ id: validUser._id,isAdmin:validUser.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({
        message: "successful login",
        user:validUser
      });
  } catch (err) {
    next(err);
  }
};

exports.google = async (req, res, next) => {
  const { name, email, profilePicture } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, generate token
      const token = jwt.sign({ id: user._id,isAdmin:user.isAdmin }, process.env.JWT_SECRET, {
        expiresIn: "90d",
      });

      res.status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json({
          message: "Successful login",
          user,
        });
    } else {
      // User does not exist, create user
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      user = new User({
        username: name.toLowerCase().replace(/\s/g, '') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture,
      });

      await user.save();

      const token = jwt.sign({ id: user._id,isAdmin:user.isAdmin }, process.env.JWT_SECRET, {
        expiresIn: "90d",
      });

      res.status(200)
        .cookie('access_token', token, { httpOnly: true })
        .json({
          message: "Success",
          user,
        });
    }
  } catch (err) {
    return next(err);
  }
};
