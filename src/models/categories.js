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

/*
 * Get categories assigned to a specific project
 */
const getCategoriesByServiceProjectId = async (projectId) => {

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

/*
 * Assign one category to one project
 */
const assignCategoryToProject = async (categoryId, projectId) => {

    const sql = `
        INSERT INTO project_category
            (category_id, project_id)
        VALUES
            ($1, $2);
    `;

    await db.query(sql, [categoryId, projectId]);
};

/*
 * Update all category assignments for a project
 */
const updateCategoryAssignments = async (projectId, categoryIds) => {

    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

export {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments
};