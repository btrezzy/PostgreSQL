"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const connectionString = "postgresql://nirajkumarpatel21:ehO7r5aQtXFs@ep-crimson-cloud-a5b9beuw.us-east-2.aws.neon.tech/nirajneondb?sslmode=require";
async function createUsersTable() {
    const client = new pg_1.Client({
        connectionString: connectionString,
    });
    await client.connect();
    try {
        const result = await client.query(`
        CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
        )
        `);
        console.log(result);
    }
    catch (err) {
        console.log("Error", err);
    }
    finally {
        await client.end();
    }
}
async function insertData(username, email, password) {
    const client = new pg_1.Client({
        connectionString: connectionString,
    });
    //don't take direct input as values in our query : might cause sql injection
    await client.connect();
    try {
        const insertquery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`;
        const values = [username, email, password];
        const result = await client.query(insertquery, values);
        console.log("Insertion Success", result);
    }
    catch (error) {
        console.log("Error", error);
    }
    finally {
        await client.end();
    }
}
async function queryData(email) {
    const client = new pg_1.Client({
        connectionString: connectionString,
    });
    await client.connect();
    try {
        const query = `SELECT * FROM users WHERE email = $1`;
        const value = [email];
        const result = await client.query(query, value);
        console.log("Success", result);
    }
    catch (err) {
        console.log("Error", err);
    }
    finally {
        await client.end();
    }
}
// createUsersTable();
insertData("niraj", "nirajkumar21@gmail.com", "7860");
insertData("nirajk", "nirajkumar22@gmail.com", "7860");
queryData("nirajkumar21@gmail.com");
