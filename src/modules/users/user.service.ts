import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./user.interface";

// Columns safe to send to clients (never include password)
const USER_PUBLIC_FIELDS =
  "id, name, age, email, is_active, role, created_at, updated_at";

const createUserIntoDB = async (payload: IUser) => {
  const { name, age, email, password, role } = payload;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users (name, age, email, password, role) VALUES
    ($1,$2,$3,$4, COALESCE($5, 'user')) RETURNING ${USER_PUBLIC_FIELDS}
    `,
    [name, age, email, hashPassword, role],
  );
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(`
    SELECT ${USER_PUBLIC_FIELDS} FROM users`);
  return result;
};

const getUserByIdFromDB = async (id: string) => {
  const result = await pool.query(
    `
      SELECT ${USER_PUBLIC_FIELDS} FROM users WHERE id = $1`,
    [id],
  );
  return result;
};
const updateUserByIdFromDB = async (id: string, payload: IUser) => {
  const { name, age, email, password, is_Active } = payload;
  const hashPassword = password ? await bcrypt.hash(password, 10) : null;
  const result = await pool.query(
    `
      UPDATE users SET name =COALESCE($1, name), age =COALESCE($2, age), password =COALESCE($3, password), is_Active =COALESCE($4, is_Active), updated_at = NOW() WHERE id = $5 RETURNING ${USER_PUBLIC_FIELDS}`,
    [name ?? null, age ?? null, hashPassword, is_Active ?? null, id],
  );
  return result;
};
const deleteUserByIdFromDB = async (id: string) => {
  const result = await pool.query(
    `
      DELETE FROM users WHERE id = $1 RETURNING ${USER_PUBLIC_FIELDS}`,
    [id],
  );

  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserByIdFromDB,
  deleteUserByIdFromDB,
};
