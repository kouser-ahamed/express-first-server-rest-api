import { pool } from "../../db";
import type { IProfile } from "./profile.interface";

const createProfileIntoDB = async (paylod: IProfile) => {
  const { user_id, bio, address, phone, gender } = paylod;

  const user = await pool.query(
    `
    SELECT * FROm users WHERE id=$1`,
    [user_id],
  );
  if (user.rowCount === 0) {
    throw new Error("User not exist in the Database");
  }
  const result = await pool.query(
    `
        INSERT INTO profiles (user_id, bio, address, phone, gender) VALUES
        ($1, $2, $3, $4, $5) RETURNING *
        `,
    [user_id, bio, address, phone, gender],
  );
  return result;
};

export const profileService = {
  createProfileIntoDB,
};
