import express from 'express'
const app = express()
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import userAuth from './routes/auth.routes'
dotenv.config()
const port  = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.status(200).json("live k liye domin  baad /api/auth etc use kre")
})
app.use('/api/auth',userAuth)
app.get('/api',(req,res)=>{
    res.status(200).json("live")
})

app.listen(port,()=>{
    console.log(`server is connect on port ${port} `);
    
})