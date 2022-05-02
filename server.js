const mongoose = require('mongoose')

const dotenv = require('dotenv')

dotenv.config({path:'./config.env'})

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

mongoose.connect(DB,{
  useNewUrlParser:true,
  useUnifiedTopology:true
})
  .then(con=>{
    //console.log(con.connections)
    console.log('Connected to DB')
  })
const app = require('./app')
//const Tour = require('./models/tourModels')

const port = process.env.PORT

app.listen(port, () => {
    console.log("Server started")
  })
  