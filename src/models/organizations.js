import db from "./db.js";

const getAllOrganizations = async () => {
    const sql = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM public.organization
        ORDER BY organization_id;
    `;

    const result = await db.query(sql);
    return result.rows;
};

export { getAllOrganizations };