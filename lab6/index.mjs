import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({ extended: true }));

//setting up database connection pool
const pool = mysql.createPool({
    host: "xefi550t7t6tjn36.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu1q4oene0aiq3jc",
    password: "b9fcllqgvd2c1pz7",
    database: "jl5z4hnnms5ct3ci",
    connectionLimit: 10,
    waitForConnections: true
});

const conn = await pool.getConnection();

//routes
app.get('/', (req, res) => {
    res.render('index')
});

//Display form for input Author information
app.get("/author/new", (req, res) => {
    res.render("newAuthor");
});

//Route to render the list of authors
app.get("/authors", async function (req, res) {
    let sql = `SELECT *
    FROM q_authors
    ORDER BY lastName`;

    const [rows] = await conn.query(sql);

    res.render("authorList", { "authors": rows })
});

//This route retrieves all data for the selected author
app.get("/author/edit", async function (req, res) {

    let authorId = req.query.authorId;

    let sql = `SELECT *, 
        DATE_FORMAT(dob, '%Y-%m-%d') dobISO,
        DATE_FORMAT(dod, '%Y-%m-%d') dodISO
        FROM q_authors
        WHERE authorId =  ${authorId}`;
    const [rows] = await conn.query(sql);
    res.render("editAuthor", { "authorInfo": rows });
});

// Route to update an existing author
app.post("/author/edit", async function (req, res) {
    let sql = `UPDATE q_authors
            SET firstName = ?,
                lastName = ?,
                dob = ?,
                dod = ?,
                sex = ?,
                profession = ?,
                country = ?,
                portrait = ?,
                biography = ?
            WHERE authorId =  ?`;


    let params = [req.body.fName,
    req.body.lName, req.body.dob, req.body.dod,
    req.body.sex, req.body.profession, req.body.country, req.body.portrait, req.body.biography, req.body.authorId];
    const [rows] = await conn.query(sql, params);
    res.redirect("/authors");
});

//This route deletes an author
app.get("/author/delete", async function (req, res) {

    let authorId = req.query.authorId;

    let sql = `DELETE
    FROM q_authors
    WHERE authorId = ?`;

    const [rows] = await conn.query(sql, [authorId]);

    res.redirect("/authors");
});

// Route to render quotes list
app.get("/quotes", async function (req, res) {
    let sql = `SELECT *
    FROM q_quotes
    ORDER BY authorId`;

    const [rows] = await conn.query(sql);

    res.render("quoteList", { "quotes": rows })
});

// Route to edit quotes
app.get("/quote/edit", async function (req, res) {

    let quoteId = req.query.quoteId;

    // Retrieves the selected quote
    let quoteSql = `SELECT * 
        FROM q_quotes
        WHERE quoteId =  ?`;
    const [quoteRows] = await conn.query(quoteSql, [quoteId]);

    //Retreives all authors for the dropdown 
    let authorSql = `SELECT authorId, firstName, lastName
    FROM q_authors
    ORDER BY lastName`;
    const [authorRows] = await conn.query(authorSql);

    //Retreives each category once for the dropdown
    let categorySql = `SELECT DISTINCT category
    FROM q_quotes
    ORDER BY category`;
    const [categoryRows] = await conn.query(categorySql);

    res.render("editQuote", { quoteInfo: quoteRows, authors: authorRows, categories: categoryRows });
});

//Route that receives the edited values and updates the database
app.post("/quote/edit", async function (req, res) {
    let sql = `UPDATE q_quotes
            SET quote = ?,
                authorId = ?,
                category = ?,
                likes= ?
            WHERE quoteId =  ?`;


    let params = [req.body.quote,
    req.body.authorId, req.body.category, req.body.likes,
    req.body.quoteId];
    const [rows] = await conn.query(sql, params);
    res.redirect("/quotes");
});

//Route to delete the selcted quote from the database by its quoteId
app.get("/quote/delete", async function (req, res) {

    let quoteId = req.query.quoteId;

    let sql = `DELETE
    FROM q_quotes
    WHERE quoteId = ?`;

    const [rows] = await conn.query(sql, [quoteId]);

    res.redirect("/quotes");
});

// Displays route form for adding a new quote
app.get("/quote/new", async function (req, res) {

    //Retrieves all authors from the author dropdown
    let authorSql = `SELECT authorId, firstName, lastName
    FROM q_authors
    ORDER BY lastName`;

    const [authorRows] = await conn.query(authorSql);

    // Retrieves each existing category once for the category dropdown
    let categorySql = `SELECT DISTINCT category
    FROM q_quotes
    ORDER BY category`;
    const [categoryRows] = await conn.query(categorySql);

    res.render("newQuote", { authors: authorRows, categories: categoryRows });
});

//Adds a new quote to the database
app.post("/quote/new", async function (req, res) {

    let quote = req.body.quote;
    let authorId = req.body.authorId;
    let category = req.body.category;
    let likes = req.body.likes;

    let sql = `INSERT INTO q_quotes
    (quote, authorId, category, likes)
    VALUES(?,?,?,?)`;

    let params = [quote, authorId, category, likes];
    const [rows] = await conn.query(sql, params);

    //Retrieves all authors from the author dropdown
    let authorSql = `SELECT authorId, firstName, lastName
    FROM q_authors
    ORDER BY lastName`;
    const [authorRows] = await conn.query(authorSql);

    // Retrieves each existing category once for the category dropdown
    let categorySql = `SELECT DISTINCT category
    FROM q_quotes
    ORDER BY category`;
    const [categoryRows] = await conn.query(categorySql);

    res.render("newQuote", { "message": "Quote added!", authors: authorRows, categories: categoryRows });
});

//Adds a new author to the database
app.post("/author/new", async function (req, res) {
    let fName = req.body.fName;
    let lName = req.body.lName;
    let birthDate = req.body.birthDate;
    let deathDate = req.body.deathDate;
    let sex = req.body.sex;
    let profession = req.body.profession;
    let country = req.body.country;
    let portrait = req.body.portrait;
    let biography = req.body.biography;
    let sql = `INSERT INTO q_authors
    (firstName, lastName, dob, dod, sex, profession, country, portrait, biography)
    VALUES (?,?,?,?,?,?,?,?,?)`;
    let params = [fName, lName, birthDate, deathDate, sex, profession, country, portrait, biography];
    const [rows] = await conn.query(sql, params);
    res.render("newAuthor", { "message": "Author added!" });
});

app.get("/dbTest", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});//dbTest

app.listen(3000, () => {
    console.log("Express server running")
})