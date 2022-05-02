const Tour = require('../models/tourModels')
const APIFeatures = require('../utils/apifeatures')



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

exports.getAllTours = async (req, res) => {
  try{
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
    res.status(200).json({
      status: "Success",
      results: tours.length,
      data: {
        tours
      },
    })
  }
  catch(err){
    res.status(404).json({
      status:"Failed",
      message:err
    })
  }
  }

  
exports.getTour = async (req, res) => {
  try{
    const tours = await Tour.findById(req.params.id)   //Tour.findOne({_id:req.params.id})
    res.status(200).json({
      status: "Success",
      data: {
        tours,
      },
    })
  }catch(err){
    res.status(404).json({
      status:"Failed",
      message:err
    })
  }

  }
  
exports.createTour = async (req, res) => {

  //const newTour = new Tour({data})
  //newTour.save()  --->below is simpler way
    try{
  const newTour = await Tour.create(req.body)
      res.status(201).json({
           status: "ok",
           data: {
             tours: newTour,
           },
         })
       }catch(err){
         res.status(400).json({
           status:"failed",
           message:err
         })
       }
}
  
exports.updateTour = async (req, res) => {
  try{
    const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
      new :true,
      runValidators:true
    })
    res.status(200).json({
      status: "replaced",
      data: {
        tours: tour,
      },
    })
  }catch(err){
    res.status(400).json({
      status:"failed",
      message:err
    })
  }

  }
  
exports.deleteTour = async (req, res) => {
  try{
    const tours = await Tour.findByIdAndDelete(req.params.id)
     res.status(200).json({
      status:"Success",
      tours,
      message:"Data deleted Succesfully"
    })
  }
    catch(err){
      res.status(404).json({
        status:"Failed",
        message:err
      })
    }
}
