const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
 const userSchema = new mongoose.Schema({
     name:{
         type:String,
         required:[true,"User must have a name"]
     },
     email:{
        type:String,
        require:[true,"User must have an email"],
        unique:true,
        lowercase:true,
        validate:[ validator.isEmail,"Please Provide a proper email"]
     },
     photo:String,
     password:{
         type:String,
         required:[true,"A user must have a password"],
         minlength:6,
         select:false
     },
     passwordConfirm:{
         type:String,
         required:true,
         validate:{
             //ONLY WORKS FOR SAVE!!
             validator: function(pass){
                return pass === this.password
             },
             message:"Password do not match"
         }
     }
    })

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm=undefined
})

userSchema.methods.correctPassword=async function(candidatePassword,userPassword){ //instance method available in all user documents
    return await bcrypt.compare(candidatePassword,userPassword)
}
   module.exports = mongoose.model('Users',userSchema)//here Users is the database collection name