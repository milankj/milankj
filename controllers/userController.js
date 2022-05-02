const User = require('../models/userModel')
const { getAllTours } = require('./tourController')
exports.getAllUsers = async (req,res)=>{
  try{
  const newUser = await User.find()
  res.status(200).json({
    status:"Success",
    results:newUser.length,
    data:{
      user:newUser
    }
  })
  }catch(err){
    res.status(500).json(
      {
        status:"Error",
        message:err
      }
    )}
  }

exports.getUser = async(req,res)=>{
  try{
    const user =  await User.findOne({_id:req.params.id})

    res.status(200).json({
    status:"Success",
    data:{
      user
      }
    })
  }catch(err){
      res.status(404).json({
        status:"Error",
        message:err
      })
    }
  }


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