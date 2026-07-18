import db from "./db.js";

/*
 * Get all categories
 */
const getAllCategories = async () => {

    const sql = `
        SELECT
            category_id,
            name
        FROM category
        ORDER BY name;
    `;

    const result = await db.query(sql);

    return result.rows;
};

/*
 * Get one category
 */
const getCategoryDetails = async (categoryId) => {

    const sql = `
        SELECT
            category_id,
            name
        FROM category
        WHERE category_id = $1;
    `;

    const result = await db.query(sql, [categoryId]);

    return result.rows.length ? result.rows[0] : null;
};

/*
 * Get every project belonging to a category
 */
const getProjectsByCategoryId = async (categoryId) => {

    const sql = `
        SELECT
            p.project_id,
            p.organization_id,
            p.name,
            p.description
        FROM project p
        JOIN project_category pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.name;
    `;

    const result = await db.query(sql, [categoryId]);

    return result.rows;
};

/*
 * Get all categories for one project
 */
const getCategoriesByProjectId = async (projectId) => {

    const sql = `
        SELECT
            c.category_id,
            c.name
        FROM category c
        JOIN project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    const result = await db.query(sql, [projectId]);

    return result.rows;
};

export {

    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByProjectId

};