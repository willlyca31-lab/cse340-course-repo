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
 * Get projects by category id
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
 * Get categories assigned to a project
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

        ORDER BY c.category_id;
    `;


    const result = await db.query(sql, [projectId]);


    return result.rows;

};






/*
 * Create new category
 */
const createCategory = async (name) => {


    const query = `
        INSERT INTO category
        (
            name
        )

        VALUES ($1)

        RETURNING category_id;
    `;



    const result = await db.query(
        query,
        [name]
    );



    if (result.rows.length === 0) {

        throw new Error(
            "Failed to create category"
        );

    }



    if (process.env.ENABLE_SQL_LOGGING === "true") {

        console.log(
            "Created category with ID:",
            result.rows[0].category_id
        );

    }



    return result.rows[0].category_id;

};







/*
 * Update existing category
 */
const updateCategory = async (
    categoryId,
    name
) => {


    const query = `
        UPDATE category

        SET
            name = $1

        WHERE category_id = $2

        RETURNING category_id;
    `;



    const values = [
        name,
        categoryId
    ];



    const result = await db.query(
        query,
        values
    );



    if (result.rows.length === 0) {

        throw new Error(
            "Category not found"
        );

    }



    if (process.env.ENABLE_SQL_LOGGING === "true") {

        console.log(
            "Updated category with ID:",
            categoryId
        );

    }



    return result.rows[0].category_id;

};








/*
 * Assign category to project
 */
const assignCategoryToProject = async (
    categoryId,
    projectId
) => {


    const query = `
        INSERT INTO project_category
        (
            category_id,
            project_id
        )

        VALUES ($1,$2);
    `;



    await db.query(
        query,
        [
            categoryId,
            projectId
        ]
    );

};







/*
 * Update project category assignments
 */
const updateCategoryAssignments = async (
    projectId,
    categoryIds
) => {


    const deleteQuery = `
        DELETE FROM project_category

        WHERE project_id = $1;
    `;



    await db.query(
        deleteQuery,
        [
            projectId
        ]
    );



    for (const categoryId of categoryIds) {


        await assignCategoryToProject(
            categoryId,
            projectId
        );


    }


};







export {

    getAllCategories,

    getCategoryDetails,

    getProjectsByCategoryId,

    getCategoriesByServiceProjectId,

    createCategory,

    updateCategory,

    assignCategoryToProject,

    updateCategoryAssignments

};