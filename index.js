require('dotenv').config();
const express = require('express')
require('./db/connection')
const router = require('./routes/router')
require('./twilio/twilio')


const server = express()

server.use(express.json())
server.use(router)
server.use(express.urlencoded({extended: false }))

const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
    console.log(`Server started at :${PORT}`);
})

server.get('/',(req,res)=>{
    res.status(200).json('Server Started')
})