import type { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    //   console.log(result);
    res.status(201).json({
      success: true,
      message: "User Created Successfully........!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB();

    // console.log(result);
    res.status(200).json({
      success: true,
      message: "Users Fetched Successfully........!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.getUserByIdFromDB(id as string);

    res.status(200).json({
      success: true,
      message: "User Fetched Successfully........!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const updateUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.updateUserByIdFromDB(
      id as string,
      req.body,
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found........!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User Updated Successfully........!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
};
