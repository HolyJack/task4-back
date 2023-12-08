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
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const port = 3000;
const prisma = new client_1.PrismaClient();
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = prisma.user.findFirst({ where: { username, password } });
    if (!user) {
        return done(null, false, { message: "Incorrect username" });
    }
    return done(null, user);
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = prisma.user.findFirst({ where: { id: id } });
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
app.use((0, express_session_1.default)({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
}));
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const status = yield prisma.user.create({
        data: {
            username,
            email,
            password,
        },
    });
}));
app.post("/signin", passport_1.default.authenticate("local", {
    successMessage: "Success",
    failureMessage: "Error",
}));
app.get("/users", passport_1.default.authenticate("session"), (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany({
        select: {
            username: true,
            createdAt: true,
            updatedAt: true,
            active: true,
        },
    });
    res.send(users);
}));
app.listen(port, () => console.log(`This app is listening on port ${port}`));
