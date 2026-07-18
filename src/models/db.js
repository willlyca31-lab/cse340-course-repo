import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;


/*
 * Database connection
 */

const isProduction =
    process.env.NODE_ENV === "production";


const pool = new Pool({

    connectionString: process.env.DB_URL,

    ssl: isProduction
        ? {
            rejectUnauthorized: false
        }
        : false

});


/*
 * Query helper
 */
const db = {

    query(text, params) {

        return pool.query(text, params);

    }

};



/*
 * Test database connection
 */
const testConnection = async () => {

    try {

        const result =
            await pool.query(
                "SELECT NOW()"
            );


        console.log(
            "Database connected:",
            result.rows[0]
        );


    } catch (error) {

        console.error(
            "Database connection failed:",
            error.message
        );

        throw error;

    }

};


export default db;

export {
    testConnection
};