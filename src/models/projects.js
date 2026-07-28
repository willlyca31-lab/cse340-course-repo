import db from "./db.js";



/*
 * Get all projects
 * Used by /projects page
 */
const getAllProjects = async () => {

    const sql = `
        SELECT
            p.project_id,
            p.organization_id,
            p.name,
            p.description,
            p.location,
            p.date,
            o.name AS organization_name

        FROM project p

        JOIN organization o
            ON p.organization_id = o.organization_id

        ORDER BY p.project_id;
    `;


    const result =
        await db.query(sql);


    return result.rows;

};








/*
 * Get one project by ID
 * Used by /project/:id page
 */
const getProjectDetails = async (
    projectId
) => {


    const sql = `
        SELECT
            p.project_id,
            p.organization_id,
            p.name,
            p.description,
            p.location,
            p.date,
            o.name AS organization_name

        FROM project p

        JOIN organization o
            ON p.organization_id = o.organization_id

        WHERE p.project_id = $1;
    `;



    const result =
        await db.query(
            sql,
            [projectId]
        );



    return result.rows.length > 0
        ? result.rows[0]
        : null;

};









/*
 * Get projects by organization
 */
const getProjectsByOrganizationId = async (
    organizationId
) => {


    const sql = `
        SELECT
            project_id,
            organization_id,
            name,
            description

        FROM project

        WHERE organization_id = $1

        ORDER BY project_id;
    `;



    const result =
        await db.query(
            sql,
            [organizationId]
        );



    return result.rows;

};









/*
 * Create new project
 */
const createProject = async (
    title,
    description,
    location,
    date,
    organizationId
) => {


    const sql = `
        INSERT INTO project
        (
            name,
            description,
            location,
            date,
            organization_id
        )

        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5
        )

        RETURNING project_id;
    `;



    const values = [

        title,

        description,

        location,

        date,

        organizationId

    ];



    const result =
        await db.query(
            sql,
            values
        );



    if(result.rows.length === 0){

        throw new Error(
            "Failed to create project"
        );

    }



    return result.rows[0].project_id;

};









/*
 * Update project
 */
const updateProject = async (
    projectId,
    name,
    description,
    location,
    date,
    organizationId
) => {


    const sql = `
        UPDATE project

        SET
            name = $1,
            description = $2,
            location = $3,
            date = $4,
            organization_id = $5

        WHERE project_id = $6

        RETURNING project_id;
    `;



    const values = [

        name,

        description,

        location,

        date,

        organizationId,

        projectId

    ];



    const result =
        await db.query(
            sql,
            values
        );



    if(result.rows.length === 0){

        throw new Error(
            "Project update failed"
        );

    }



    return result.rows[0].project_id;

};









/*
 * Get categories belonging to project
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








export {

    getAllProjects,

    getProjectDetails,

    getProjectsByOrganizationId,

    createProject,

    updateProject,

    getCategoriesByProjectId

};