import type { Request, Response, NextFunction } from "express";
import sendResponse from "../utils/sendResponse";
import config from "../config";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { pool } from "../db";
import type { Role } from "../types";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log(roles);
      // console.log("This is Protected Route......!");
      // console.log(req.headers.authorization)
      const token = req.headers.authorization;
      if (!token) {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized Access",
        });
      }

      const decode = jwt.verify(
        token as string,
        config.jwt_Secret as string,
      ) as JwtPayload;
      //   console.log(decode);
      const user = await pool.query(`SELECT * FROM users WHERE id=$1`, [
        decode.id,
      ]);
      // console.log(user.rows[0]);
      if (user.rowCount === 0) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "User Not Found",
        });
      }

      if (!user.rows[0].is_active) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden Access",
        });
      }

      if (roles.length > 0 && !roles.includes(user.rows[0].role)) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Unauthorized Access",
        });
      }

      req.user = decode;
      // console.log(req);

      next();
    } catch (error) {
      next(error);
    }
  };
};
export default auth;
