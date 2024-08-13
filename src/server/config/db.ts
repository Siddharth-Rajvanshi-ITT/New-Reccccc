import mysql from 'mysql2/promise';
export const pool = mysql.createPool({
  host: 'localhost',
  password:'root',
  user: 'root', 
  database: 'recommendation_engine1',
});