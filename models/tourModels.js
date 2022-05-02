const validator = require('validator')
const slugify = require('slugify')

const mongoose = require('mongoose')

const tourSchema  = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'A tour must have a name'],
    unique:true,
    trim:true,
    minlength:[4,"A tour name should have a minimum of  10 characters"],
    maxlength:[40,"A Tour name can have a maximum of  40 characters"],
    //validate: [validator.isAlpha,'Tour name must only contain aplhabets']
  },
  duration:{
      type:Number,
      required:[true,'Tour must have duration']
  },
  maxGroupSize:{
    type:Number,
    required:[true,'Tour must have a grooup size']
  },
  difficulty:{
    type:String,
    required:[true,'A Tour must have a difficulty mentioned'],
    enum:{
    values:["easy","medium","difficult"],
    message:"difficulty can only be easy,medium or difficult"
   }
  },
  rating:{
    type:Number,
    default:4.5,
    min:[1,'Rating must be greater than 0'],
    max:[5,"Rating can only have a max value of 5"]
  },
  ratingAverage:{
    type:Number,
    default:4.5
  },
  ratingQuantity:{
    type:Number,
    default:0
  },
  priceDiscount:Number,
  summary:{
      type:String,
      trim:true, //removes all white spaces in the begining and the end 
      required:[true,'Tour must have a description summary']
  },
  price:{
    type:Number,
    required:[true,'A tour must have a price']
  },
  description:{
      type:String,
      trim:true,
      //this keyword in validator works only when creating a new document not for update
      validate:{
        validator:function (value){
           return (value.length<=200 && value.length>=5)
        },
      message:"Decription must be between 5 to 200 words"
      }
  },
  slug:String,
  imageCover:{
      type:String
  },
  image:[String],//image array of strings
  createdAt:{
      type:Date,
      default:Date.now(),
      select:false
  },
  startDates:[Date],
  secretTour:{
    type:Boolean,
    default:false
  }
})

//DOCUMENT MIDDLEWARE RUNS BEFORE .save() and .create()

tourSchema.pre('save',function(next){
  this.slug = slugify(this.name,{lower:true})
  next()
})
tourSchema.pre('save',function(next){
  console.log('Document Saving....')
  next()
})
tourSchema.post('save',function(doc,next){
  console.log(doc)
  next()
})

tourSchema.post('save',function(doc,next){
  console.log('Document Saved Successfully,,,')
  next()
})
tourSchema.pre(/^find/,function(next){ //regular expression that starts with find
//tourSchema.pre('find',function(next))
  this.find({secretTour:{$ne:true}})
  next()
})

const Tour = mongoose.model('Tour',tourSchema) // Tour is database collection name
 
module.exports = Tour
