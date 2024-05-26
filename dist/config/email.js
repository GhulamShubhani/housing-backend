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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: 'mxslurp.click',
    port: 2525,
    secure: false,
    auth: {
        user: 'gsBuWJYbLfmrHcCuaboLPD3UZhF7NAn0',
        pass: 'EHr7cwLo68IYAS3FKt8csK5oFOTLPDr3'
    }
});
const sendMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, html }) {
    const mailOption = {
        from: 'gsBuWJYbLfmrHcCuaboLPD3UZhF7NAn0',
        to,
        subject,
        html,
    };
    try {
        console.log(mailOption);
        yield transporter.sendMail(mailOption);
        console.log('send successfull');
    }
    catch (error) {
        console.log(error === null || error === void 0 ? void 0 : error.message);
    }
});
exports.sendMail = sendMail;
