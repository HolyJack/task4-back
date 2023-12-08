"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function authenticate(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
exports.default = authenticate;
