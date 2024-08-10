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
export const getMenuItems = async() => {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM menu_items");

  console.log(rows)
    // Iterate over the rows
    const user = {
      item_id: rows[0].item_id,
      name:rows[0].name,
      category:rows[0].category,
      price:rows[0].price,
      availability_status:rows[0].availability_status
    }
    if(user)
      return user
    else
      return null
}
