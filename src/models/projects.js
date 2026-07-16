const db = require("./db");

const getAllProjects = async () => {
    const sql = `
        SELECT
            project.project_id,
            project.name,
            project.description,
            organization.name AS organization_name
        FROM public.project
        JOIN public.organization
            ON project.organization_id = organization.organization_id
        ORDER BY project.project_id;
    `;

    const result = await db.query(sql);

    return result.rows;
};

module.exports = {
    getAllProjects
};