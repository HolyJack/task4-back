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
exports.auth = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const db_1 = __importDefault(require("../utils/db"));
const auth = express_1.default.Router();
exports.auth = auth;
auth.post("/signin", (req, res, next) => passport_1.default.authenticate("local", (err, user, info) => {
    if (err)
        return next(err);
    if (!user)
        return res.status(401).json({ message: info === null || info === void 0 ? void 0 : info.message });
    req.login(user, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return next(err);
        try {
            yield db_1.default.user.update({
                where: { id: user.id },
                data: { signinAt: new Date().toISOString() },
            });
        }
        catch (err) {
            next(err);
        }
        return res.json({ message: "Login successful!", user: user.username });
    }));
})(req, res, next));
auth.delete("/signout", (req, res) => {
    res.clearCookie("connect.sid");
    req.logout(function () {
        req.session.destroy(function () {
            res.send();
        });
    });
});
auth.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    if (!username || !email || !password) {
        res.status(422).json({
            status: "fail",
            message: "Please enter valid username, e-mail and password",
        });
        return;
    }
    if (yield db_1.default.user.findFirst({ where: { username } })) {
        res.status(409).json({
            status: "fail",
            message: "User already exists",
        });
        return;
    }
    const user = yield db_1.default.user.create({
        data: {
            username,
            email,
            password,
            active: true,
        },
    });
    res.status(201).json({
        status: "created",
        username: user.username,
    });
}));
