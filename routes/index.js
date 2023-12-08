"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./auth");
const users_1 = require("./users");
const router = (0, express_1.Router)();
router.use(auth_1.auth);
router.use(users_1.users);
exports.default = router;
