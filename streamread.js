var http = require('http')


const fs  =  require('fs')
const server = http.createServer()
server.on('request',(req,res)=>{
    console.log('rerequest recieeved')
})
server.on('request',(req,res)=>{
    console.log('another request')
})
server.on('close',()=>{
    console.log('Server Closed')
})

server.listen(6000,'127.0.0.1',()=>{
    console.log('Server Started')
})