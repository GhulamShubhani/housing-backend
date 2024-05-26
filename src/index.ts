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

app.use('/api/auth',userAuth)

app.listen(port,()=>{
    console.log(`server is connect on port ${port} `);
    
})