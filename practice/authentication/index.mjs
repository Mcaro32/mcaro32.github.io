import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import session from 'express-session';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//initialize session variable
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

//for Express to get values using POST method
app.use(express.urlencoded({ extended: true }));

//setting up database connection pool
const pool = mysql.createPool({
    host: 'xefi550t7t6tjn36.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'xu1q4oene0aiq3jc',
    password: 'b9fcllqgvd2c1pz7',
    database: 'jl5z4hnnms5ct3ci',
    connectionLimit: 10,
    waitForConnections: true
});

const conn = await pool.getConnection();


let authenticated = false;

//routes
app.get('/', (req, res) => {
    res.render('login')
});

app.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(password);

    let passwordHash = ""


    let sql = `SELECT *
FROM admin
WHERE username = ?
`;
    const [rows] = await conn.query(sql, [username]);
    if (rows.length > 0) { // It found at least one record
        passwordHash = rows[0].password;
    }

    let match = await bcrypt.compare(password, passwordHash);

    if (match) {
        req.session.authenticated = true;
        res.render('welcome')
    } else {
        res.redirect("/");
    }
});

app.get('/profile', (req, res) => {
    if (req.session.authenticated) {
        res.render('profile')
    } else {
        res.redirect('/');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')
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