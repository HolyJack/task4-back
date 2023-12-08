import { Request, Response, NextFunction } from "express";

export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
