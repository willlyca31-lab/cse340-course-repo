import db from "./db.js";

/*
 * Add a user as a volunteer for a project
 */
const addVolunteer = async (userId, projectId) => {

    const query = `
        INSERT INTO project_volunteer
        (
            user_id,
            project_id
        )
        VALUES
        (
            $1,
            $2
        )
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING user_id, project_id;
    `;

    const result = await db.query(
        query,
        [userId, projectId]
    );

    return result.rows.length > 0
        ? result.rows[0]
        : null;
};


/*
 * Remove a user from a project
 */
const removeVolunteer = async (userId, projectId) => {

    const query = `
        DELETE FROM project_volunteer
        WHERE user_id = $1
        AND project_id = $2;
    `;

    const result = await db.query(
        query,
        [userId, projectId]
    );

    return result.rowCount;
};


/*
 * Get all projects a user has volunteered for
 */
const getProjectsByVolunteer = async (userId) => {

    const query = `
        SELECT
            p.project_id,
            p.organization_id,
            p.name,
            p.description,
            o.name AS organization_name

        FROM project_volunteer pv

        JOIN project p
            ON pv.project_id = p.project_id

        JOIN organization o
            ON p.organization_id = o.organization_id

        WHERE pv.user_id = $1

        ORDER BY p.name;
    `;

    const result = await db.query(
        query,
        [userId]
    );

    return result.rows;
};


/*
 * Check if a user is already volunteering
 */
const isVolunteer = async (userId, projectId) => {

    const query = `
        SELECT user_id, project_id
        FROM project_volunteer
        WHERE user_id = $1
        AND project_id = $2;
    `;

    const result = await db.query(
        query,
        [userId, projectId]
    );

    return result.rows.length > 0;
};


export {
    addVolunteer,
    removeVolunteer,
    getProjectsByVolunteer,
    isVolunteer
};