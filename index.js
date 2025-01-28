import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import errorHandling from "./src/middlewares/errorHandler.js";
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 5003;

//Middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//Usando rotas definidas
app.use("/user", userRoutes); // verifique se a base de /use está configurada

// Error handling middleware
app.use(errorHandling);

//Testing POSTGRES Connection
app.get("/", async (req, res) => {
    try{
        const result = await pool.query("SELECT current_database()");
        res.send(`The database name is : ${result.rows[0].current_database}`);
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).send("Database connection error");    
    }
});

// Server running
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

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