import { Client } from "pg";

const connectionString =
  "postgresql://nirajkumarpatel21:ehO7r5aQtXFs@ep-crimson-cloud-a5b9beuw.us-east-2.aws.neon.tech/nirajneondb?sslmode=require";

async function createUsersTable() {
  const client = new Client({
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
  } catch (err) {
    console.log("Error", err);
  } finally {
    await client.end();
  }
}

async function insertData(username: string, email: string, password: string) {
  const client = new Client({
    connectionString: connectionString,
  });

  //don't take direct input as values in our query : might cause sql injection
  await client.connect();

  try {
    const insertquery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`;
    const values = [username, email, password];

    const result = await client.query(insertquery, values);
    console.log("Insertion Success", result);
  } catch (error) {
    console.log("Error", error);
  } finally {
    await client.end();
  }
}

async function queryData(email: string) {
  const client = new Client({
    connectionString: connectionString,
  });
  await client.connect();

  try {
    const query = `SELECT * FROM users WHERE email = $1`;
    const value = [email];
    const result = await client.query(query, value);

    console.log("Success", result);
  } catch (err) {
    console.log("Error", err);
  } finally {
    await client.end();
  }
}

async function createAddressTable() {
  const client = new Client({ connectionString: connectionString });
  await client.connect();

  const query = await client.query(`
         CREATE TABLE address(
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            city VARCHAR(50) NOT NULL,
            country VARCHAR(50) NOT NULL,
            pincode VARCHAR(50),
            FOREIGN KEY (user_id) REFERENCES users(id)
         )
        `);
}

async function insertAddressData(
  user_id: number,
  city: string,
  country: string,
  pincode: string
) {
  const client = new Client({ connectionString: connectionString });
  await client.connect();

  const query = `INSERT INTO address (user_id, city, country, pincode) VALUES ($1, $2, $3, $4)`;
  const values = [user_id, city, country, pincode];

  const result = await client.query(query, values);
  console.log("Insertion Success", result);
}

async function queryAddressDate(user_id: number) {
  const client = new Client({ connectionString: connectionString });
  await client.connect();

  const query = `SELECT * FROM address WHERE user_id = $1`;
  const value = [user_id];

  const result = await client.query(query, value);
  console.log("Success", result);
}

async function updateAddressData(
  user_id: number,
  city: string,
  country: string,
  pincode: string
) {
  const client = new Client({ connectionString: connectionString });
  await client.connect();

  const query = `UPDATE address SET city = $1, country = $2, pincode = $3 WHERE user_id = $4`;
  const values = [city, country, pincode, user_id];

  const result = await client.query(query, values);
  console.log("Update Success", result);
}

async function joinQuery(user_id: number) {
  const client = new Client({ connectionString });
  await client.connect();

  const query = `SELECT u.id, u.username, u.email, a.city, a.country, a.pincode 
                     FROM users u JOIN address a ON u.id = a.user_id
                     WHERE u.id = $1`;

  const result = await client.query(query, [user_id]);
  console.log("Success", result);
}

createUsersTable();
insertData("niraj", "nirajkumar21@gmail.com", "7860");
insertData("nirajk", "nirajkumar22@gmail.com", "7860");
queryData("nirajkumar21@gmail.com");
insertAddressData(1, "Ahmedabad", "India", "380015");
updateAddressData(1, "Gandhinagar", "India", "382015");
queryAddressDate(1);
joinQuery(1);
