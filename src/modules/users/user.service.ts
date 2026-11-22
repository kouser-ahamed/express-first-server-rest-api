import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserIntoDB = async (payload: IUser) => {
  const { name, age, email, password } = payload;
  const result = await pool.query(
    `
    INSERT INTO users (name, age, email, password) VALUES
    ($1,$2,$3,$4) RETURNING * 
    `,
    [name, age, email, password],
  );
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(`
    SELECT * FROM users`);
  return result;
};

const getUserByIdFromDB = async (id: string) => {
  const result = await pool.query(
    `
      SELECT * FROM users WHERE id = $1`,
    [id],
  );
  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
};
