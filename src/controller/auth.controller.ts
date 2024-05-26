import { Request, Response } from "express"
import Joi from 'joi';
import bcrypt from 'bcrypt'
import prisma from '../../lib/prisma'
import jwt from 'jsonwebtoken'
import { sendMail } from "../../config/email";

export const registerFunction = async (req: Request, res: Response) => {
    const userSchema = Joi.object({
        userName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })

    const { error } = userSchema.validate(req.body, {
        allowUnknown: true,
        abortEarly: true
    })

    if (error) {
        console.log(error, "0o0");

        return res.status(400).json({ message: error.details[0].message })
    }
    try {
        // destructure variaable 
        const { userName, email, password } = req.body

        // check user is present to not 


        // hash password 
        const genreateSalt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, genreateSalt)



        // create new user 

        const newUser = await prisma.user.create({
            data: {
                userName,
                email,
                password: hashPassword
            }
        })


        const otp = Math.floor(+ 100000 + Math.random() * 900000)


        const newOtp = await prisma.otp.create({
            data:{
                otp,
                userID: newUser.id,
            }
        })


        // if ( true) {
        if (newUser && newOtp) {
            
            const htmlText = `
                <h1>Welcome to Our Service</h1>
                <p>Your OTP is <strong>${otp}</strong></p>
                 <p>Please use this OTP to complete your registration.</p>
        `
            await sendMail({
                to:req.body.email,
                subject:'send otp ',
                html:htmlText
            })
        }


        // return  res.status(201).json({message:hashPassword})
        return res.status(201).json({ message: "user create successfully", otp })

    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ message: error.message })
    }
}
export const loginFunction = async (req: Request, res: Response) => {
    try {
        const ExpTime = '7d'; // Use a readable format for JWT expiration
        const { password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { userName: req.body.userName },
                    { email: req.body.email }
                ]
            }
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, userName: user.userName },
            process.env.SECRET_KEY as string,
            { expiresIn: ExpTime }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure the secure flag is set in production
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days in milliseconds
        });

        return res.status(200).json({ message: 'Login successful' });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
export const logoutFunction = async (req: Request, res: Response) => {
    return res.clearCookie('token').status(200).json({ message: "logout successful" })
}

export const verifynotication = () => {

}
