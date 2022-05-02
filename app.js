const express = require("express")
const morgan = require("morgan")
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
  res.status(404).json({
    status:"Fail",
    message:`Can't find ${req.originalUrl} on this server`
  })
})

module.exports = app

