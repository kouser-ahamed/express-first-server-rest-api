import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  // check if the user exist -> Done
  // check if the  password match->Done
  //check the user status-> Done
  // if pass all then generate jwt  token

  const { email, password } = payload;
  const user = await pool.query(
    `SELECT * FROM users WHERE email=$1
    `,
    [email],
  );

  if (user.rowCount === 0) {
    throw new Error("Invalid Credentials!!"); // Credintials -> Credentials
  }
  const matchPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!matchPassword) {
    throw new Error("Invalid Credentials!!"); // Credintials -> Credentials
  }
  if (!user.rows[0].is_active) {
    throw new Error("Access Denied!!"); // Credintials -> Credentials
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };
  // Log only non-sensitive fields (never password or token)
  console.log("User logged in:", {
    ...jwtPayload,
    is_active: user.rows[0].is_active,
  });

  const accessToken = jwt.sign(jwtPayload, config.jwt_Secret as string, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(jwtPayload, config.refresh_Secret as string, {
    expiresIn: "10d",
  });
  return { accessToken, refreshToken, user: user.rows[0] };
};
const generateAccessToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized Access");
  }

  const decode = jwt.verify(
    token as string,
    config.refresh_Secret as string,
  ) as JwtPayload;

  const user = await pool.query(`SELECT * FROM users WHERE id=$1`, [
    decode.id,
  ]);

  if (user.rowCount === 0) {
    throw new Error("User Not Found");
  }

  if (!user.rows[0].is_active) {
    throw new Error("Forbidden Access");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_Secret as string, {
    expiresIn: "1h",
  });

  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
  generateAccessToken,
};
