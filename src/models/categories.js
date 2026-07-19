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


    return result.rows.length > 0
        ? result.rows[0]
        : null;

};



/*
 * Get projects belonging to one category
 * Used by /category/:id page
 */
const getProjectsByCategoryId = async (categoryId) => {

    const sql = `
        SELECT
            p.project_id,
            p.name,
            p.description,
            o.name AS organization_name

        FROM project_category pc

        JOIN project p
            ON pc.project_id = p.project_id

        JOIN organization o
            ON p.organization_id = o.organization_id

        WHERE pc.category_id = $1

        ORDER BY p.project_id;
    `;


    const result = await db.query(sql, [categoryId]);


    return result.rows;

};



export {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId
};