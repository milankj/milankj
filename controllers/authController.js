const User = require('../models/userModel')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')

const signToken = (id)=>{
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN})
}
exports.signup = catchAsync (async(req,res,next)=>{
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    })
    //TOKEN CREATION BEFORE FN  
    // const token = jwt.sign({id:_id},process.env.JWT_SECRET,{
    //     expiresIn:process.env.JWT_EXPIRES_IN
    // })

    const token = signToken(newUser._id)

    res.status(201).json({
    status:"Success",
    token,
    data:{
        user:newUser
    }
})
})
exports.protect = async(req,res,next)=>{
    
    let token,decoded
        //  1. GETTING TOKEN AND CHECK IF ITS THERE
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1] 
    }
    if(!token){
        return next(new AppError('Not Logged in please log in to get access'))   
    }
        
        //  2.VERIFICATION TOKEN
    try{
     decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);   
    console.log(decoded)
    }
    catch(err){
        return next(new AppError(err,500))
    }
    
        //  3.CHECK IF USER STILL EXISTS
    const freshUser = await User.findById(decoded.id)
    if(!freshUser){
        return next(new AppError('User of this token no longer exits'),401)
    }
    
        //  4.CHECK IF USER CHANGED PASSWORD AFTER  TOKEN WAS ISSUED
    if(freshUser.changePasswordAfter(decoded.iat)){
        next(new AppError(''),401)
    }
    req.user = freshUser
    //GRANT ACCESS TO PROTECTED ROUTE
    next()
}
exports.login = catchAsync (async (req,res,next)=>{
    const {email,password}= req.body
    //1)CHECK IF EMAIL AND PASSWORD EXIST
        if(!email || !password){
        return next(new AppError('Please provide email and password',400))
        }

    //2)CHECK IF USER AND PASSWORD IS CORRECT
    const user = await User.findOne({email}).select('+password')
    if(!user || !(await user.correctPassword(password,user.password))){
        return next(new AppError('Incorrect email or password',401))
    }

    //3)IS EVERYTHING OK SEND TOKEN TO CLIENT
    const token = signToken(user._id)
    res.status(200).json({
        status:"Succes",
        message:"user Logged in Succesfully",
        token
    })
})