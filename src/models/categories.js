import db from "./db.js";

export async function getAllCategories() {

    const sql = `
        SELECT category_id, name
        FROM category
        ORDER BY name;
    `;

    const result = await db.query(sql);

    return result.rows;
}