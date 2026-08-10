import db from "./db.js";
import bcrypt from "bcrypt";

// =========================
// Create a new user
// =========================

const createUser = async (name, email, passwordHash) => {
    const default_role = "user";

    const query = `
        INSERT INTO users (
            name,
            email,
            password_hash,
            role_id
        )
        VALUES (
            $1,
            $2,
            $3,
            (
                SELECT role_id
                FROM roles
                WHERE role_name = $4
            )
        )
        RETURNING user_id
    `;

    const queryParams = [
        name,
        email,
        passwordHash,
        default_role
    ];

    const result = await db.query(
        query,
        queryParams
    );

    if (result.rows.length === 0) {
        throw new Error("Failed to create user");
    }

    if (process.env.ENABLE_SQL_LOGGING === "true") {
        console.log(
            "Created new user with ID:",
            result.rows[0].user_id
        );
    }

    return result.rows[0].user_id;
};

// =========================
// Find user by email
// =========================

const findUserByEmail = async (email) => {
    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            u.role_id,
            r.role_name
        FROM users u
        JOIN roles r
            ON u.role_id = r.role_id
        WHERE u.email = $1
    `;

    const queryParams = [email];

    const result = await db.query(
        query,
        queryParams
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

// =========================
// Verify password
// =========================

const verifyPassword = async (
    password,
    passwordHash
) => {
    return bcrypt.compare(
        password,
        passwordHash
    );
};

// =========================
// Authenticate user
// =========================

const authenticateUser = async (
    email,
    password
) => {
    const user = await findUserByEmail(email);

    // User does not exist
    if (!user) {
        return null;
    }

    // Check password
    const passwordValid = await verifyPassword(
        password,
        user.password_hash
    );

    // Incorrect password
    if (!passwordValid) {
        return null;
    }

    // Remove password hash before returning user
    const {
        password_hash,
        ...authenticatedUser
    } = user;

    return authenticatedUser;
};

// =========================
// Get all users
// =========================

const getUsers = async () => {
    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            r.role_name
        FROM users u
        JOIN roles r
            ON u.role_id = r.role_id
        ORDER BY u.name
    `;

    const result = await db.query(query);

    return result.rows;
};

// =========================
// Exports
// =========================

export {
    createUser,
    authenticateUser,
    getUsers
};