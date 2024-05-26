import express from 'express'
import { loginFunction, logoutFunction, registerFunction } from '../controller/auth.controller'
const authRouter = express.Router()

export default authRouter

authRouter.post('/register',registerFunction)
authRouter.post('/login',loginFunction)
authRouter.post('/logout',logoutFunction)