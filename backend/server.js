import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = new DatabaseSync("data.db");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tables = { startups: "startups" }; // Storing this like an enum for ease of use


// Table creations:
function createTables() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS ${tables.startups} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            time DATETIME DEFAULT CURRENT_TIMESTAMP,
            username TEXT
        )
    `); // Uhh store logins i guess :)
}

createTables();

// Now we prepare queries
const qLogins = db.prepare(`SELECT * FROM ${tables.startups} ORDER BY time DESC`);

// Now we prepare insertions
const iLogin = db.prepare(`INSERT INTO ${tables.startups} (username) VALUES (?)`);

console.log("Login historry:", qLogins.all());

app.use(express.static(path.join(__dirname, 'static')));

app.post("/api/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) return res.json({ success: false, error: "Unmatched credentials" });

    try {
        iLogin.run(username);
        const allLogins = qLogins.all();
        res.json({ success: true, history: allLogins });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Database error" });
    }
});

// Rahahahah what do I doooo
// :sob:

app.listen(3000);