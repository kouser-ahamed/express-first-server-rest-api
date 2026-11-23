import { pool } from "../../db";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  // check if the user exist
  // check if the  password match
  //check the user status
  // if pass all then generate jwt  token

  const { email, password } = payload;
  const user = await pool.query(
    `SELECT * FROM users WHERE email=$1
    `,
    [email],
  );
  //   console.log(user.rows[0]);

  if (user.rowCount === 0) {
    throw new Error("Invalid Credentials!!"); // Credintials -> Credentials
  }
};

export const authService = {
  loginUserIntoDB,
};
