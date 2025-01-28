import pkg from "pg";
import dotenv from "dotenv";
const  {Pool}  = pkg;

dotenv.config();

console.log(process.env.DB_USER);
console.log(process.env.DB_HOST);


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Function to create the necessary table if it doesn't exist
const createTableIfNotExists = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS equipe_ubs (
        id SERIAL PRIMARY KEY,
        logradouro VARCHAR(255),
        numinic VARCHAR(50),
        numfin VARCHAR(50),
        cep VARCHAR(20),
        cor_equipe VARCHAR(50),
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    try {
        await pool.query(query);
        console.log("Table 'equipe_ubs' is ready.");
      } catch (err) {
        console.error("Error creating table:", err.message);
      }
};  

pool.on("connect", () => {
    console.log("Connection pool establised with Database");
});

pool.on("error", () => {
    console.error("Error no pool de conexões");
});

export default pool;