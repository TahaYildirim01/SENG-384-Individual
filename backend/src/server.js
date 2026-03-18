const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePerson(full_name, email) {
  if (!full_name || !full_name.trim()) {
    return "FULL_NAME_REQUIRED";
  }
  if (!email || !email.trim()) {
    return "EMAIL_REQUIRED";
  }
  if (!emailRegex.test(email)) {
    return "INVALID_EMAIL_FORMAT";
  }
  return null;
}

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/people", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM people ORDER BY id ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET /api/people error:", error);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

app.get("/api/people/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM people WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET /api/people/:id error:", error);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

app.post("/api/people", async (req, res) => {
  const { full_name, email } = req.body;
  const validationError = validatePerson(full_name, email);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const result = await pool.query(
      "INSERT INTO people (full_name, email) VALUES ($1, $2) RETURNING *",
      [full_name.trim(), email.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST /api/people error:", error);

    if (error.code === "23505") {
      return res.status(409).json({ error: "EMAIL_ALREADY_EXISTS" });
    }

    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

app.put("/api/people/:id", async (req, res) => {
  const { id } = req.params;
  const { full_name, email } = req.body;

  const validationError = validatePerson(full_name, email);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const result = await pool.query(
      "UPDATE people SET full_name = $1, email = $2 WHERE id = $3 RETURNING *",
      [full_name.trim(), email.trim(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("PUT /api/people/:id error:", error);

    if (error.code === "23505") {
      return res.status(409).json({ error: "EMAIL_ALREADY_EXISTS" });
    }

    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

app.delete("/api/people/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM people WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }

    res.status(200).json({ message: "PERSON_DELETED" });
  } catch (error) {
    console.error("DELETE /api/people/:id error:", error);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});