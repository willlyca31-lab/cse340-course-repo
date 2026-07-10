import db from "./db.js";

export async function getAllCategories() {

    const sql = `
        SELECT category_id, name
        FROM category
        ORDER BY name;
    `;

    const result = await pool.query(sql);

    return result.rows;
}