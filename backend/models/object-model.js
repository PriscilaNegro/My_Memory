import db from "../config/db-postgres.js";
export const getAllObjects = async() => {
    const result = await db.query (
        "Select * from objects");
    
    return result.rows;
}