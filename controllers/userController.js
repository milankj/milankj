const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')


exports.getAllUsers = catchAsync( async (req,res,next)=>{
  const newUser = await User.find()
  res.status(200).json({
    status:"Success",
    results:newUser.length,
    data:{
      user:newUser
    }
  })
})
exports.getUser = catchAsync( async(req,res,next)=>{
  const user =  await User.findOne({_id:req.params.id})

  res.status(200).json({
  status:"Success",
  data:{
    user
    }
  })
})


exports.createUser = (req,res)=>{
    res.status(500).json(
      {
        status:"Error",
        message:"Not defined"
      }
    )
  }


exports.updateUser = (req,res)=>{
    res.status(500).json(
      {
        status:"Error",
        message:"Not defined"
      }
    )
  }


exports.deleteUSer = (req,res)=>{
    res.status(500).json(
      {
        status:"Error",
        message:"Not defined"
      }
    )
  }