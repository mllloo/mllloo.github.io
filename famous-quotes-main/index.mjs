// index.mjs
import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import session from 'express-session';
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

// ─── Sessions ─────────────────────────────────────────────────────────────────

app.use(session({
  secret: 'quotefinder_secret_2024',
  resave: false,
  saveUninitialized: false
}));

// Make fullName available in every view
app.use((req, res, next) => {
  res.locals.fullName = req.session.fullName || null;
  res.locals.isLoggedIn = !!req.session.authenticated;
  next();
});

// ─── Auth Middleware ──────────────────────────────────────────────────────────

function requireLogin(req, res, next) {
  if (req.session.authenticated) return next();
  res.redirect('/login');
}

// ─── Login / Logout ───────────────────────────────────────────────────────────

app.get('/login', (req, res) => {
  if (req.session.authenticated) return res.redirect('/');
  res.render('login', { loginError: null });
});

app.post('/loginProcess', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM admin WHERE username = ?', [username]
    );
    if (rows.length === 0) {
      return res.render('login', { loginError: 'Invalid username or password.' });
    }
    const match = await bcrypt.compare(password, rows[0].password.trim());
    if (!match) {
      return res.render('login', { loginError: 'Invalid username or password.' });
    }
    req.session.authenticated = true;
    req.session.fullName = rows[0].firstName + ' ' + rows[0].lastName;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', { loginError: 'Server error. Please try again.' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// ─── Home / Search ────────────────────────────────────────────────────────────

app.get("/", requireLogin, async (req, res) => {
  const [quotes] = await pool.query(`
    SELECT q.quoteId, q.quote, q.likes, q.category,
           CONCAT(a.firstName, ' ', a.lastName) AS name,
           a.authorId
    FROM quotes q
    JOIN authors a ON q.authorId = a.authorId
    ORDER BY q.quoteId DESC
  `);
  const [categories] = await pool.query("SELECT DISTINCT category FROM quotes ORDER BY category");
  res.render("home", { quotes, categories, error: null });
});

app.get("/search", requireLogin, async (req, res) => {
  const { keyword, author, category, min, max } = req.query;

  if (keyword && keyword.length < 3) {
    const [categories] = await pool.query("SELECT DISTINCT category FROM quotes ORDER BY category");
    return res.render("home", { error: "Keyword must be at least 3 characters.", quotes: [], categories });
  }

  let sql = `
    SELECT q.quoteId, q.quote, q.likes, q.category,
           CONCAT(a.firstName, ' ', a.lastName) AS name, a.authorId
    FROM quotes q
    JOIN authors a ON q.authorId = a.authorId
    WHERE 1=1
  `;
  const params = [];
  if (keyword)    { sql += " AND q.quote LIKE ?";                            params.push(`%${keyword}%`); }
  if (author)     { sql += " AND CONCAT(a.firstName,' ',a.lastName) LIKE ?"; params.push(`%${author}%`); }
  if (category)   { sql += " AND q.category = ?";                            params.push(category); }
  if (min && max) { sql += " AND q.likes BETWEEN ? AND ?";                   params.push(min, max); }
  sql += " ORDER BY q.quoteId DESC";

  const [quotes]     = await pool.query(sql, params);
  const [categories] = await pool.query("SELECT DISTINCT category FROM quotes ORDER BY category");
  res.render("home", { quotes, categories, error: null });
});

// ─── Author JSON for modal ────────────────────────────────────────────────────

app.get("/author/:id", requireLogin, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM authors WHERE authorId = ?", [req.params.id]);
  res.json(rows[0] || {});
});

// ─── Authors CRUD ─────────────────────────────────────────────────────────────

app.get("/authors", requireLogin, async (req, res) => {
  const [authors] = await pool.query("SELECT * FROM authors ORDER BY lastName, firstName");
  res.render("authors", { authors });
});

app.get("/newAuthor", requireLogin, (req, res) => {
  res.render("newAuthor", { errors: [], old: {} });
});

app.post("/newAuthor", requireLogin, async (req, res) => {
  const { firstName, lastName, sex, dob, dod, biography, portrait } = req.body;
  const errors = [];
  if (!firstName?.trim()) errors.push("First name is required.");
  if (!lastName?.trim())  errors.push("Last name is required.");
  if (!sex)               errors.push("Sex is required.");
  if (!biography?.trim()) errors.push("Biography is required.");
  if (errors.length > 0) return res.render("newAuthor", { errors, old: req.body });

  await pool.query(
    "INSERT INTO authors (firstName, lastName, sex, dob, dod, biography, portrait) VALUES (?,?,?,?,?,?,?)",
    [firstName.trim(), lastName.trim(), sex, dob || null, dod || null, biography.trim(), portrait?.trim() || null]
  );
  res.redirect("/authors");
});

app.get("/editAuthor/:id", requireLogin, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM authors WHERE authorId = ?", [req.params.id]);
  if (rows.length === 0) return res.redirect("/authors");
  res.render("editAuthor", { author: rows[0], errors: [] });
});

app.post("/editAuthor/:id", requireLogin, async (req, res) => {
  const { firstName, lastName, sex, dob, dod, biography, portrait } = req.body;
  const errors = [];
  if (!firstName?.trim()) errors.push("First name is required.");
  if (!lastName?.trim())  errors.push("Last name is required.");
  if (!sex)               errors.push("Sex is required.");
  if (!biography?.trim()) errors.push("Biography is required.");
  if (errors.length > 0) {
    return res.render("editAuthor", { author: { authorId: req.params.id, ...req.body }, errors });
  }
  await pool.query(
    "UPDATE authors SET firstName=?, lastName=?, sex=?, dob=?, dod=?, biography=?, portrait=? WHERE authorId=?",
    [firstName.trim(), lastName.trim(), sex, dob || null, dod || null, biography.trim(), portrait?.trim() || null, req.params.id]
  );
  res.redirect("/authors");
});

app.post("/deleteAuthor/:id", requireLogin, async (req, res) => {
  await pool.query("DELETE FROM authors WHERE authorId = ?", [req.params.id]);
  res.redirect("/authors");
});

// ─── Quotes CRUD ──────────────────────────────────────────────────────────────

app.get("/newQuote", requireLogin, async (req, res) => {
  const [authors]    = await pool.query("SELECT * FROM authors ORDER BY lastName, firstName");
  const [categories] = await pool.query("SELECT DISTINCT category FROM quotes ORDER BY category");
  res.render("newQuote", { authors, categories, errors: [], old: {} });
});

app.post("/newQuote", requireLogin, async (req, res) => {
  const { quote, authorId, category, likes } = req.body;
  const errors = [];
  if (!quote?.trim())    errors.push("Quote text is required.");
  if (!authorId)         errors.push("Author is required.");
  if (!category?.trim()) errors.push("Category is required.");
  if (errors.length > 0) {
    const [authors]    = await pool.query("SELECT * FROM authors ORDER BY lastName, firstName");
    const [categories] = await pool.query("SELECT DISTINCT category FROM quotes ORDER BY category");
    return res.render("newQuote", { authors, categories, errors, old: req.body });
  }
  await pool.query(
    "INSERT INTO quotes (quote, authorId, category, likes) VALUES (?,?,?,?)",
    [quote.trim(), authorId, category.trim(), likes || 0]
  );
  res.redirect("/");
});

app.get("/editQuote/:id", requireLogin, async (req, res) => {
  const [rows]       = await pool.query("SELECT * FROM quotes WHERE quoteId = ?", [req.params.id]);
  if (rows.length === 0) return res.redirect("/");
  const [authors]    = await pool.query("SELECT * FROM authors ORDER BY lastName, firstName");
  const [categories] = await pool.query("SELECT DISTINCT category FROM quotes ORDER BY category");
  res.render("editQuote", { quote: rows[0], authors, categories, errors: [] });
});

app.post("/editQuote/:id", requireLogin, async (req, res) => {
  const { quote, authorId, category, likes } = req.body;
  const errors = [];
  if (!quote?.trim())    errors.push("Quote text is required.");
  if (!authorId)         errors.push("Author is required.");
  if (!category?.trim()) errors.push("Category is required.");
  if (errors.length > 0) {
    const [authors]    = await pool.query("SELECT * FROM authors ORDER BY lastName, firstName");
    const [categories] = await pool.query("SELECT DISTINCT category FROM quotes ORDER BY category");
    return res.render("editQuote", { quote: { quoteId: req.params.id, ...req.body }, authors, categories, errors });
  }
  await pool.query(
    "UPDATE quotes SET quote=?, authorId=?, category=?, likes=? WHERE quoteId=?",
    [quote.trim(), authorId, category.trim(), likes || 0, req.params.id]
  );
  res.redirect("/");
});

app.post("/deleteQuote/:id", requireLogin, async (req, res) => {
  await pool.query("DELETE FROM quotes WHERE quoteId = ?", [req.params.id]);
  res.redirect("/");
});

// ─── Author Quotes page ───────────────────────────────────────────────────────

app.get("/authorQuotes/:id", requireLogin, async (req, res) => {
  const [authorRows] = await pool.query("SELECT * FROM authors WHERE authorId = ?", [req.params.id]);
  if (authorRows.length === 0) return res.redirect("/authors");
  const [quotes] = await pool.query(
    "SELECT quoteId, quote, likes, category FROM quotes WHERE authorId = ? ORDER BY likes DESC",
    [req.params.id]
  );
  res.render("authorQuotes", { author: authorRows[0], quotes });
});

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));