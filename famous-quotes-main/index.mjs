import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host: "x40p5pp7n9rowyv6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: process.env.API_KEY,
  password: process.env.DB_PWD,
  database: "holfoa150gdduh62",
  connectionLimit: 10
});

app.get("/", async (req, res) => {
  let [categories] = await pool.query("SELECT DISTINCT category FROM quotes");
  res.render("home", { quotes: [], categories, error: null });
});

app.get("/search", async (req, res) => {
  let { keyword, author, category, min, max } = req.query;

  if (keyword && keyword.length < 3) {
    let [categories] = await pool.query("SELECT DISTINCT category FROM quotes");
    return res.render("home", {
      error: "Keyword must be at least 3 characters",
      quotes: [],
      categories
    });
  }

  let sql = `
    SELECT q.quote, q.likes, q.category,
           CONCAT(a.firstName, ' ', a.lastName) AS name,
           a.authorId
    FROM quotes q
    JOIN authors a ON q.authorId = a.authorId
    WHERE 1=1
  `;

  let params = [];

  if (keyword) {
    sql += " AND q.quote LIKE ?";
    params.push(`%${keyword}%`);
  }

  if (author) {
    sql += " AND CONCAT(a.firstName, ' ', a.lastName) LIKE ?";
    params.push(`%${author}%`);
  }

  if (category) {
    sql += " AND q.category = ?";
    params.push(category);
  }

  if (min && max) {
    sql += " AND q.likes BETWEEN ? AND ?";
    params.push(min, max);
  }

  let [quotes] = await pool.query(sql, params);
  let [categories] = await pool.query("SELECT DISTINCT category FROM quotes");

  res.render("home", { quotes, categories, error: null });
});

app.get("/author/:id", async (req, res) => {
  let [rows] = await pool.query(
    "SELECT * FROM authors WHERE authorId = ?",
    [req.params.id]
  );
  res.json(rows[0]);
});

app.get("/newAuthor", (req, res) => {
  res.render("newAuthor");
});

app.post("/newAuthor", async (req, res) => {
  let { firstName, lastName, sex, dob, dod, biography, portrait } = req.body;

  await pool.query(
    "INSERT INTO authors (firstName, lastName, sex, dob, dod, biography, portrait) VALUES (?,?,?,?,?,?,?)",
    [firstName, lastName, sex, dob, dod, biography, portrait]
  );

  res.redirect("/");
});

app.get("/newQuote", async (req, res) => {
  let [authors] = await pool.query("SELECT * FROM authors");
  res.render("newQuote", { authors });
});

app.post("/newQuote", async (req, res) => {
  let { quote, authorId, category, likes } = req.body;

  await pool.query(
    "INSERT INTO quotes (quote, authorId, category, likes) VALUES (?,?,?,?)",
    [quote, authorId, category, likes]
  );

  res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));