import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true,
      sameSite: "lax", // Adjust based on your requirements lax, strict, none-->CSRF
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
      path: "/", // Set the path for the cookie
      domain: "localhost", // Set the domain for the cookie (adjust as needed) example: "example.com" for production
    });

    res.status(200).json({
      success: true,
      message: "User Logged In Successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};




const generateToken = async (req: Request, res: Response) => {
  try {
    console.log(req.cookies.refreshToken); 
    const result = await authService.generateAccessToken(req.cookies.refreshToken);
   

    res.status(200).json({
      success: true,
      message: "Access Token Generated Successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

export const authController = {
  loginUser,
  generateToken,
};
