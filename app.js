const express = require("express")
const morgan = require("morgan")
const AppError = require('./utils/AppError')
const globalErrorHandler = require('./utils/globalError')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const app = express()

//middlewares
if(process.env.NODE_ENV==='development'){
  app.use(morgan("dev"))
}

app.use(express.json()) //middleware to parse request


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  //console.log(req.headers)
  next()
})


//route handlers

//ROUTES

//app.get('/api/v1/tours',getAllTours)
//app.post('/api/v1/tours',createTour)
// app.get('/api/v1/tours/:id',getTour)
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id',deleteTour)


app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)

//ERROR HANDLING

app.all('*',(req,res,next)=>{
  // const err = new Error(`Can't find ${req.originalUrl} on this server`)
  // err.status='Fail'
  // err.statusCode = 404
  next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
})
//global error handling   
app.use(globalErrorHandler) 

module.exports = app

