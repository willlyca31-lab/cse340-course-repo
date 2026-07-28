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


    const result =
        await db.query(sql);


    return result.rows;

};







/*
 * Get one category by ID
 */
const getCategoryDetails = async (
    categoryId
) => {


    const sql = `
        SELECT
            category_id,
            name

        FROM category

        WHERE category_id = $1;
    `;



    const result =
        await db.query(
            sql,
            [categoryId]
        );



    return result.rows.length > 0
        ? result.rows[0]
        : null;

};







/*
 * Get projects by category
 */
const getProjectsByCategoryId = async (
    categoryId
) => {


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



    const result =
        await db.query(
            sql,
            [categoryId]
        );



    return result.rows;

};







/*
 * Get categories assigned to project
 */
const getCategoriesByProjectId = async (
    projectId
) => {


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



    const result =
        await db.query(
            sql,
            [projectId]
        );



    return result.rows;

};







/*
 * Assign category to project
 */
const assignCategoryToProject = async (
    projectId,
    categoryId
) => {


    const sql = `

        INSERT INTO project_category

        (

            project_id,

            category_id

        )


        VALUES

        (

            $1,

            $2

        );

    `;



    await db.query(
        sql,
        [
            projectId,
            categoryId
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


    const deleteSql = `

        DELETE FROM project_category

        WHERE project_id = $1;

    `;



    await db.query(
        deleteSql,
        [projectId]
    );



    for (const categoryId of categoryIds) {


        await assignCategoryToProject(
            projectId,
            categoryId
        );


    }

};








/*
 * Create new category
 */
const createCategory = async (
    name
) => {


    const sql = `

        INSERT INTO category

        (

            name

        )


        VALUES

        (

            $1

        )


        RETURNING category_id;

    `;



    const result =
        await db.query(
            sql,
            [name]
        );



    if (result.rows.length === 0) {

        throw new Error(
            "Failed to create category"
        );

    }



    return result.rows[0].category_id;

};









/*
 * Update category
 */
const updateCategory = async (
    categoryId,
    name
) => {


    const sql = `

        UPDATE category

        SET

            name = $1


        WHERE category_id = $2


        RETURNING category_id;

    `;



    const result =
        await db.query(
            sql,
            [
                name,
                categoryId
            ]
        );



    if (result.rows.length === 0) {

        throw new Error(
            "Category update failed"
        );

    }



    return result.rows[0].category_id;

};







export {


    getAllCategories,


    getCategoryDetails,


    getProjectsByCategoryId,


    getCategoriesByProjectId,


    updateCategoryAssignments,


    createCategory,


    updateCategory

};