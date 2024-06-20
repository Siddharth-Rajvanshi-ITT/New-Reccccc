import { RowDataPacket } from "mysql2";
import { pool } from "../config/db";

export const getUserByIdAndPassword = async(id:string,password:string) => {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM users where id = ? and password = ?",[id,password]);
  
      // Iterate over the rows
      const user = {
        id: rows[0].id,
        name:rows[0].name,
        role:rows[0].role
      }
      if(user)
        return user
      else
        return null
}

