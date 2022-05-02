const User = require('../models/userModel')

const jwt = require('jsonwebtoken')

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