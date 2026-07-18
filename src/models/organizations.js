import db from "./db.js";

/*
 * Get all organizations
 */
const getAllOrganizations = async () => {

    const sql = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organization
        ORDER BY name;
    `;

    const result = await db.query(sql);

    return result.rows;
};

/*
 * Get one organization
 */
const getOrganizationDetails = async (organizationId) => {

    const sql = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organization
        WHERE organization_id = $1;
    `;

    const result = await db.query(sql, [organizationId]);

    return result.rows.length ? result.rows[0] : null;
};

export {
    getAllOrganizations,
    getOrganizationDetails
};