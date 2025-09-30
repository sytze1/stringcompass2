// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const { Pool } = require("pg");


// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/uploads', express.static('uploads'));

// // PostgreSQL connection
// const pool = new Pool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// // Auth routes
// import authRoutes from "./routes/auth.js";
// app.use("/api/auth", authRoutes);







// // GET QUERIES

// // Get all luthiers
// app.get("/api/luthiers", async (req, res) => {
//     try {
//       console.log("Received request for /api/luthiers");
//       const result = await pool.query("SELECT * FROM luthiers");
//       res.json(result.rows);
//     } catch (err) {
//       console.error("DB error:", err);
//       res.status(500).json({ error: "Database error" });
//     }
// });
  
// // Get first 8 luthiers
// app.get("/api/luthiers/featured", async (req, res) => {
//     try {
//       const result = await pool.query("SELECT * FROM luthiers ORDER BY id LIMIT 8");
//       res.json(result.rows);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Database error");
//     }
// });

// // Get first 10 instruments

// app.get("/api/instruments/featured", async (req, res) => {
//     try {
//       const result = await pool.query(`
//         SELECT i.id, i.title, i.instrument_type, i.year_built, i.price, 
//                i.condition, i.location, l.name AS luthier_name
//         FROM instruments i
//         JOIN luthiers l ON i.maker_id = l.id
//         WHERE i.is_active = true
//         ORDER BY i.created_at DESC
//         LIMIT 10;
//       `);
  
//       // For each instrument, fetch media
//       const instruments = await Promise.all(
//         result.rows.map(async inst => {
//           const media = await pool.query(
//             "SELECT id, media_type, url FROM instrument_media WHERE instrument_id = $1",
//             [inst.id]
//           );
//           return { ...inst, media: media.rows };
//         })
//       );
  
//       res.json(instruments);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Database error");
//     }
//   });
  

// app.listen(process.env.PORT || 5000, () => {
// console.log(`Server running on port ${process.env.PORT || 5000}`);
// });