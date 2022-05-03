const Tour = require('../models/tourModels')
const APIFeatures = require('../utils/apifeatures')
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')

//for reading from local file
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
//   )

exports.cheapTopFive = (req,res,next)=>{ //to add predefined queries
  req.query.sort = '-rating,price'
  req.query.fields= 'name,price,ratingAverage,difficulty'
  //req.query.limit = parseInt('5')
  console.log(req.query)
  next()
}

exports.getAllTours = catchAsync(async (req, res,next) => {
  console.log('starting get tour')
  //const tours = await Tour.find()
  const features = new APIFeatures(Tour.find(),req.query).filter()
    .limitFields()
    .sort()
    .paginate()
  const tours = await features.query
  //Filtering
  // const queryObj = {...req.query}//create a soft copy
  // //const tours = await Tour.find(req.query)
  // let queryStr = JSON.stringify(queryObj)
  // queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`)
  // let query = Tour.find(JSON.parse(queryStr))
  //sorting
  // if(req.query.sort){
  //   const sortBy = req.query.sort.split(',').join(' ')
  //   query = query.sort(sortBy)
  // }
  // else{
  //   query = query.sort('-createdAt')
  // }
  //Limiting Fields
  // if(req.query.fields){
  //   const fields = req.query.fields.split(',').join(' ')
  //   query = query.select(fields)
  // }else{
  //   query = query.select('-__v')//'-' no select __v
  // }

  //EXECUTE QUERY
  //const features = new APIFeatures(Tour.find(),req.query).filter()
  // const tours = await query
          //filtering
  // const tours = await Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy')
  if(!tours){
    return next(new AppError(`No Tours FOund`,404))
  }
  res.status(200).json({
    status: "Success",
    results: tours.length,
    data: {
      tours
    },
  })
  })
  
exports.getTour = catchAsync(async (req, res,next) => {
  const tours = await Tour.findById(req.params.id)//Tour.findOne({_id:req.params.id})
  if(!tours){
    return next(new AppError(`No Tour Found with that ID`,404))
  }   
  res.status(200).json({
    status: "Success",
    data: {
      tours,
    }
  })
})

  
exports.createTour = catchAsync( async (req, res) => {

  //const newTour = new Tour({data})
  //newTour.save()  --->below is simpler way
  const newTour = await Tour.create(req.body)
      res.status(201).json({
           status: "ok",
           data: {
             tours: newTour,
           },
         })
})
  
exports.updateTour = catchAsync (async (req, res,next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
    new :true,
    runValidators:true
  })
  if(!tour){
    return next(new AppError('Cant invalid tour id ',404))
  }
  res.status(200).json({
    status: "replaced",
    data: {
      tours: tour,
    },
  })
  })
  
exports.deleteTour = catchAsync (async (req, res) => {
  const tours = await Tour.findByIdAndDelete(req.params.id)
  res.status(200).json({
   status:"Success",
   tours,
   message:"Data deleted Succesfully"
 })
})
