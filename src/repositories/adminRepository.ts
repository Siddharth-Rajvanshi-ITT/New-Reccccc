import { RowDataPacket } from "mysql2";
import { pool } from "../config/db";

export const insertDataByAdmin = async(id: number, name: string, category: string, price: number, availability:string) => {
    const [rows] = await pool.query<RowDataPacket[]>("INSERT INTO menu (item_id, name , category, price, availability_status) VALUES (item_id = ?, name=? , category=?, price=?, availability_status=?)",[id, name, category, price, availability]);
  
      // Iterate over the rows
      const itemDetails = {
        id: rows[0].item_id,
        name:rows[0].name,

      }
      if(itemDetails)
        return itemDetails
      else
        return null
}
