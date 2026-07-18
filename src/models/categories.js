import db from "./db.js";


/*
 * Get all categories
 * Used by /categories page
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
 * Get one category by ID
 * Used by /category/:id page
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
 * Get all projects belonging to a category
 * Used by /category/:id page
 */
const getProjectsByCategoryId = async (categoryId) => {

    const sql = `
        SELECT
            p.project_id,
            p.name,
            p.description
        FROM project p

        INNER JOIN project_category pc
            ON p.project_id = pc.project_id

        WHERE pc.category_id = $1

        ORDER BY p.name;
    `;

    const result = await db.query(sql, [categoryId]);

    return result.rows;
};



/*
 * Get all categories belonging to one project
 * Used by /project/:id page
 */
const getCategoriesByProjectId = async (projectId) => {

    const sql = `
        SELECT
            c.category_id,
            c.name

        FROM category c

        INNER JOIN project_category pc
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