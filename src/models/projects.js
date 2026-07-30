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
            o.name AS organization_name

        FROM project p

        JOIN organization o
            ON p.organization_id = o.organization_id

        ORDER BY p.project_id;
    `;


    const result = await db.query(sql);

    return result.rows;

};



/*
 * Get one project by ID
 * Used by /project/:id page
 */
const getProjectDetails = async (projectId) => {

    const sql = `
        SELECT
            p.project_id,
            p.organization_id,
            p.name,
            p.description,
            o.name AS organization_name

        FROM project p

        JOIN organization o
            ON p.organization_id = o.organization_id

        WHERE p.project_id = $1;
    `;


    const result = await db.query(sql, [projectId]);


    return result.rows.length > 0
        ? result.rows[0]
        : null;

};



/*
 * Get projects belonging to one organization
 * Used by /organization/:id page
 */
const getProjectsByOrganizationId = async (organizationId) => {

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


    const result = await db.query(sql, [organizationId]);


    return result.rows;

};



/*
 * Get categories belonging to one project
 * Used by /project/:id page
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
    getAllProjects,
    getProjectDetails,
    getProjectsByOrganizationId,
    getCategoriesByProjectId
};