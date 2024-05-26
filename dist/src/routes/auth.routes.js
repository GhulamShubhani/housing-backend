"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const authRouter = express_1.default.Router();
exports.default = authRouter;
authRouter.post('/register', auth_controller_1.registerFunction);
authRouter.post('/login', auth_controller_1.loginFunction);
authRouter.post('/logout', auth_controller_1.logoutFunction);
