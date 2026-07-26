import express from "express";
import mysql from "mysql2/promise";

const app = express();
const conn = mysql.createPool({
    host: "xefi550t7t6tjn36.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu1q4oene0aiq3jc",
    password: "b9fcllqgvd2c1pz7",
    database: "jl5z4hnnms5ct3ci",
    connectionLimit: 10,
    waitForConnections: true
});


app.set("view engine", "ejs");

app.use(express.static("public"));

// app.get("/", (req, res) => {
//     res.render("index");
// });

// app.get("/dbTest", async (req, res) => {
//     try {
//         const [rows] = await pool.query("SELECT * FROM q_authors");
//         res.send(rows);
//     } catch (error) {
//         console.log(error);
//         res.send("Database connection failed");
//     }
// });

app.get("/searchByKeyword", async (req, res) => {
    let keyword = req.query.keyword;

    let sql = `SELECT authorId, firstName, lastName, quote, likes
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE quote LIKE ?`;

    let sqlParams = [`%${keyword}%`];

    const [rows] = await conn.query(sql, sqlParams);

    res.render("results", { "quotes": rows });
});

app.get("/searchByAuthor", async (req, res) => {

    let authorId = req.query.authorId;

    let sql = `SELECT authorId, firstName, lastName, quote, likes
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE authorId = ?`;

    let sqlParams = [authorId];

    const [rows] = await conn.query(sql, sqlParams);

    res.render("results", { quotes: rows });
});

app.get("/searchByCategory", async (req, res) => {

    let category = req.query.category;

    let sql = `SELECT authorId, firstName, lastName, quote, likes
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE category = ?`;

    let sqlParams = [category];

    const [rows] = await conn.query(sql, sqlParams);

    res.render("results", { quotes: rows });
});

app.get("/searchByLikes", async (req, res) => {

    let minLikes = req.query.minLikes;
    let maxLikes = req.query.maxLikes;
    let sortOrder = req.query.sortOrder;

    let sql = `SELECT authorId, firstName, lastName, quote, likes
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE likes BETWEEN ? AND ?`;

    if (sortOrder === "DESC") {
        sql += ` ORDER BY likes DESC`;
    } else {
        sql += ` ORDER BY likes ASC`;
    }

    let sqlParams = [minLikes, maxLikes];

    const [rows] = await conn.query(sql, sqlParams);

    res.render("results", { quotes: rows });
});



// app.get('/', async (req,res) =>{
    
//     let sql = `SELECT authorId, firstName, lastName
//     FROM q_authors
//     ORDER BY lastName`;
//     const [rows] = await conn.query(sql);
//     res.render("index",{"authors":rows});
// });

app.get("/", async (req, res) => {

    let sql = `SELECT authorId, firstName, lastName
               FROM q_authors
               ORDER BY lastName`;

    const [authors] = await conn.query(sql);

    sql = `SELECT DISTINCT category
           FROM q_quotes
           ORDER BY category`;

    const [categories] = await conn.query(sql);

    res.render("index", {
        authors: authors,
        categories: categories
    });
});

app.get('/api/author/:id', async (req, res) => {
    let authorId = req.params.id;
    let sql = `SELECT *
    FROM q_authors
    WHERE authorId = ?`;
    const [rows] = await conn.query(sql, [authorId]);
    res.send(rows);
})


app.listen(3000, () => {
    console.log("Server started on port 3000");
});