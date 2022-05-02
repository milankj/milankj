const User = require('../models/userModel')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const { default: isFloat } = require('validator/lib/isFloat')
const { token } = require('morgan')

const signToken = (id)=>{
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN})
}
exports.signup = async(req,res,next)=>{
    try
    {
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
    })}
    catch(err){
        res.status(404).json({
            status:"Failed",
            message:err
          })
    }
}
exports.protect = async(req,res,next)=>{
    
    let token
    //  1. GETTING TOKEN AND CHECK IF ITS THERE
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1] 
    }
    if(!token){
        console.log('User not logged in ')
        return    
    }
    //  2.VERIFICATION TOKEN
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);   
    console.log(decoded)
    //  3.CHECK IF USER STILL EXISTS
    //  4.CHECK IF USER CHANGED PASSWORD AFTER  TOKEN WAS ISSUED
    next()
}
exports.login = async (req,res)=>{
    try
    {
        
    const {email,password}= req.body
    //1)CHECK IF EMAIL AND PASSWORD EXIST
        if(!email || !password){
        return res.status(400).json({
                status:"Failed",
                message:"Provide proper Login"
            })
        }

    //2)CHECK IF USER AND PASSWORD IS CORRECT
    const user = await User.findOne({email}).select('+password')
    if(!user || !(await user.correctPassword(password,user.password))){
        return res.status(401).json({
            status:"FAILED",
            message:"incorrect password or mail"
        })
    }

    //3)IS EVERYTHING OK SEND TOKEN TO CLIENT
    const token = signToken(user._id)
    res.status(200).json({
        status:"Succes",
        message:"user Logged in Succesfully",
        token
    })
    }catch(err){
        res.status(404).json({
            status:"Failed",
            message:"Incorrect login"
        })
    }
}