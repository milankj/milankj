const mongoose = require('mongoose')

const dotenv = require('dotenv')

const fs = require('fs')

const Tour = require('../../models/tourModels')
const res = require('express/lib/response')


dotenv.config({path:'./config.env'})

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

mongoose.connect(DB,{
  useNewUrlParser:true,
  useUnifiedTopology:true
})
  .then(con=>{
    console.log('Connected to DB')
  })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'))

const importData = async () =>{
    try{
    await Tour.create(tours)
    console.log('Data Successfully loaded')
    }
    catch(err){
        console.log(err)
    }
}  

const deleteData = async()=>{
    try{
        await Tour.deleteMany()
        console.log('Data Deleted')
    }
    catch(err){
        console.log(err)
    }
}
if(process.argv[2]==='--import'){
    importData()
    
}
else if(process.argv[2]==='--delete'){
    deleteData()
}
console.log(process.argv)