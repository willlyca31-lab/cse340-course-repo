import db from "./db.js";

/*
 * Get all projects
 */
const getAllProjects = async () => {

    const query = `
        SELECT
            p.project_id,
            p.organization_id,
            p.name,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name
        FROM project p
        JOIN organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.name;
    `;

    const result = await db.query(query);

    return result.rows;
};


/*
 * Get one project by ID
 */
const getProjectDetails = async (projectId) => {

    const query = `
        SELECT
            p.project_id,
            p.organization_id,
            p.name,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name
        FROM project p
        JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await db.query(
        query,
        [projectId]
    );

    return result.rows.length > 0
        ? result.rows[0]
        : null;
};


/*
 * Get projects by organization
 */
const getProjectsByOrganizationId = async (organizationId) => {

    const query = `
        SELECT
            project_id,
            organization_id,
            name,
            description,
            location,
            project_date
        FROM project
        WHERE organization_id = $1
        ORDER BY name;
    `;

    const result = await db.query(
        query,
        [organizationId]
    );

    return result.rows;
};


/*
 * Get categories assigned to project
 */
const getCategoriesByProjectId = async (projectId) => {

    const query = `
        SELECT
            c.category_id,
            c.name
        FROM category c
        JOIN project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    const result = await db.query(
        query,
        [projectId]
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
    projectDate,
    organizationId
) => {

    const query = `
        INSERT INTO project
        (
            organization_id,
            name,
            description,
            location,
            project_date
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
        organizationId,
        title,
        description,
        location,
        projectDate
    ];

    const result = await db.query(
        query,
        values
    );

    if (result.rows.length === 0) {
        throw new Error(
            "Failed to create project"
        );
    }

    if (process.env.ENABLE_SQL_LOGGING === "true") {
        console.log(
            "Created project ID:",
            result.rows[0].project_id
        );
    }

    return result.rows[0].project_id;
};


/*
 * Update existing project
 */
const updateProject = async (
    projectId,
    title,
    description,
    location,
    projectDate,
    organizationId
) => {

    const query = `
        UPDATE project
        SET
            organization_id = $1,
            name = $2,
            description = $3,
            location = $4,
            project_date = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const values = [
        organizationId,
        title,
        description,
        location,
        projectDate,
        projectId
    ];

    const result = await db.query(
        query,
        values
    );

    if (result.rows.length === 0) {
        throw new Error(
            "Project not found"
        );
    }

    if (process.env.ENABLE_SQL_LOGGING === "true") {
        console.log(
            "Updated project ID:",
            projectId
        );
    }

    return result.rows[0].project_id;
};


export {
    getAllProjects,
    getProjectDetails,
    getProjectsByOrganizationId,
    getCategoriesByProjectId,
    createProject,
    updateProject
};