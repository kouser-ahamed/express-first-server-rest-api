import type { Request, Response, NextFunction } from "express";
import config from "../config";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { pool } from "../db";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  // console.log("This is Protected Route......!");
  // console.log(req.headers.authorization)
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }

  const decode = jwt.verify(token as string, config.jwtSecret as string) as JwtPayload;
//   console.log(decode);
const user = await pool.query(`SELECT * FROM users WHERE id=$1`, [decode.id]);
// console.log(user.rows[0]);
if (user.rowCount === 0) {
  res.status(404).json({
    success: false,
    message: "User Not Found",
  });

  if(!user.rows[0].is_active){
    res.status(403).json({
      success: false,
      message: "Forbidden Access",
    });
  }
}
  next();
};
export default auth;
