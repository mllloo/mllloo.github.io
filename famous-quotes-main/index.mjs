import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

const pool = mysql.createPool({
    host: "x40p5pp7n9rowyv6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: process.env.API_KEY,
    password: process.env.DB_PWD,
    database: "holfoa150gdduh62",
    connectionLimit: 10,
    waitForConnections: true
});

app.get('/', async (req, res) => {
   let sql = `SELECT authorId, firstName, lastName
              FROM authors
              ORDER BY lastName`;
   const [authors] = await pool.query(sql);              
   res.render('home.ejs', {authors});
});

app.get('/searchByAuthor', async (req, res) => {
   let authorId = req.query.authorId;
   let sql = `SELECT quote, firstName, lastName
              FROM quotes
              NATURAL JOIN authors
              WHERE authorId = ?`;
   let sqlParams = [authorId];
   const [rows] = await pool.query(sql, sqlParams);
   res.render('quotes.ejs', {rows});
});

app.get("/searchByKeyword", async(req, res) => {
   let keyword = req.query.keyword;
   let sql = `SELECT quote, firstName, lastName
              FROM quotes
              NATURAL JOIN authors
              WHERE quote LIKE ?`;
   let sqlParams = [`%${keyword}%`];
   const [rows] = await pool.query(sql, sqlParams);
   res.render("quotes.ejs", {rows});
});

app.listen(3000);