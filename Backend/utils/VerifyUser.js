const jwt=require('jsonwebtoken')
const ErrorHandler = require('./Error');

const verifyToken=(req,res,next)=>{
    const token=req.cookies.access_token;
    if(!token){
        return next(ErrorHandler(401,'unAuthorized'));

    }

    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
        return next(ErrorHandler(401,'unAuthorized'));

        }
        req.user=user;
        next();
    })

}

module.exports = verifyToken;
