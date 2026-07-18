import db from "./db.js";

/*
 * Get all projects
 */
const getAllProjects = async () => {
    const sql = `
        SELECT
            project.project_id,
            project.organization_id,
            project.name,
            project.description,
            organization.name AS organization_name
        FROM project
        JOIN organization
            ON project.organization_id = organization.organization_id
        ORDER BY project.project_id;
    `;

    const result = await db.query(sql);
    return result.rows;
};

/*
 * Get one project by id
 */
const getProjectDetails = async (projectId) => {
    const sql = `
        SELECT
            project.project_id,
            project.organization_id,
            project.name,
            project.description,
            organization.name AS organization_name
        FROM project
        JOIN organization
            ON project.organization_id = organization.organization_id
        WHERE project.project_id = $1;
    `;

    const result = await db.query(sql, [projectId]);

    return result.rows.length ? result.rows[0] : null;
};

/*
 * Get projects for one organization
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

export {
    getAllProjects,
    getProjectDetails,
    getProjectsByOrganizationId
};