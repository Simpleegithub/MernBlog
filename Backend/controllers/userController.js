const User = require("../Models/UserModel");
const { ErrorHandler } = require("../utils/Error");
const bcrypt = require("bcryptjs");

exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "success",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message || err.toString(),
    });
  }
};

exports.updateUser = async (req, res, next) => {
  console.log(req.user);
  if (req.user.id !== req.params.id) {
    return next(ErrorHandler(403, "You are not allowed to update this user"));
  }

  if (req.body.password) {
    if (!req.body.password.length < 6) {
      return next(ErrorHandler(400, "Password must be atleast 8 characters"));
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username > 20) {
      return next(
        ErrorHandler(400, "Username must be between 7 and 20 characters")
      );
    }

    if (req.body.username.includes(" ")) {
      return next(ErrorHandler(400, "Username cannot contain spaces"));
    }

    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(ErrorHandler(400, "Username must be lowerCase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        ErrorHandler(400, "Username must contains letters and numbers")
      );
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        username: req.body.username,
        email: req.body.email,
        profilePicture: req.body.profilePicture,
        password: req.body.password,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).json({
      message: "successfully updated",
      user:updatedUser
    });
  } catch (error) {
    next(error);
  }
};


exports.deleteUser=async(req,res,next)=>{
  console.log(req.user.id,req.params.id,'form line 82')
  if (!req.user.isAdmin) {
    return next(ErrorHandler(403, "You are not allowed to delete this user"));
  }
  try{
     await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message:"Successfully deleted"
    })

  } catch(error){
   next(error.message)
  }

}


exports.signOut=(req,res,next)=>{
  try{

    res.clearCookie('access_token').status(200).json('User has been signed out')
  } catch(error){
    next(error)
  }
}




 exports.getUsers = async (req, res, next) => {

  if (!req.user.isAdmin) {
    return next(ErrorHandler(403, "You are not allowed to see the users"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex || 0);
    const limit = parseInt(req.query.limit || 9);
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

