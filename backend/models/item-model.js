import db from "../config/db-postgres.js";
export const getAllItems = async() => {
    const result = await db.query (
        "Select * from items");
    
    return result.rows;
}