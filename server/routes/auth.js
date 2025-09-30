// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { body, validationResult } from "express-validator";
// import pool from "../db.js"; // your pg pool connection

// const router = express.Router();

// // REGISTER
// router.post(
//   "/register",
//   body("email").isEmail(),
//   body("password").isLength({ min: 6 }),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//     const { name, email, password, role } = req.body;

//     try {
//       // check if user exists
//       const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//       if (existing.rows.length > 0) return res.status(400).json({ msg: "Email already registered" });

//       // hash password
//       const hashedPassword = await bcrypt.hash(password, 10);

//       const result = await pool.query(
//         "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
//         [name, email, hashedPassword, role || "user"]
//       );

//       res.json(result.rows[0]);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Server error");
//     }
//   }
// );

// // LOGIN
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//     if (userRes.rows.length === 0) return res.status(400).json({ msg: "Invalid credentials" });

//     const user = userRes.rows[0];
//     const validPassword = await bcrypt.compare(password, user.password_hash);
//     if (!validPassword) return res.status(400).json({ msg: "Invalid credentials" });

//     // create JWT token
//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       process.env.JWT_SECRET || "supersecret",
//       { expiresIn: "1h" }
//     );

//     res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// export default router;
