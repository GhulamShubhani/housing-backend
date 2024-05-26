"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifynotication = exports.logoutFunction = exports.loginFunction = exports.registerFunction = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../../config/email");
const registerFunction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userSchema = joi_1.default.object({
        userName: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
    });
    const { error } = userSchema.validate(req.body, {
        allowUnknown: true,
        abortEarly: true
    });
    if (error) {
        console.log(error, "0o0");
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        // destructure variaable 
        const { userName, email, password } = req.body;
        // check user is present to not 
        // hash password 
        const genreateSalt = yield bcrypt_1.default.genSalt(10);
        const hashPassword = yield bcrypt_1.default.hash(password, genreateSalt);
        // create new user 
        const newUser = yield prisma_1.default.user.create({
            data: {
                userName,
                email,
                password: hashPassword
            }
        });
        const otp = Math.floor(+100000 + Math.random() * 900000);
        const newOtp = yield prisma_1.default.otp.create({
            data: {
                otp,
                userID: newUser.id,
            }
        });
        // if ( true) {
        if (newUser && newOtp) {
            const htmlText = `
                <h1>Welcome to Our Service</h1>
                <p>Your OTP is <strong>${otp}</strong></p>
                 <p>Please use this OTP to complete your registration.</p>
        `;
            yield (0, email_1.sendMail)({
                to: req.body.email,
                subject: 'send otp ',
                html: htmlText
            });
        }
        // return  res.status(201).json({message:hashPassword})
        return res.status(201).json({ message: "user create successfully", otp });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});
exports.registerFunction = registerFunction;
const loginFunction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ExpTime = '7d'; // Use a readable format for JWT expiration
        const { password } = req.body;
        const user = yield prisma_1.default.user.findFirst({
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
        const checkPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, userName: user.userName }, process.env.SECRET_KEY, { expiresIn: ExpTime });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure the secure flag is set in production
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days in milliseconds
        });
        return res.status(200).json({ message: 'Login successful' });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.loginFunction = loginFunction;
const logoutFunction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.clearCookie('token').status(200).json({ message: "logout successful" });
});
exports.logoutFunction = logoutFunction;
const verifynotication = () => {
};
exports.verifynotication = verifynotication;
