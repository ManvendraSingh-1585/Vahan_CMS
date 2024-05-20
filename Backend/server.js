const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "vahan_db"
});

db.connect(err => {
    if (err) {
        console.error(err);
    } else {
        console.log("Connected to database");
    }
});

app.post('/entities', (req, res) => {
    const { name, attributes } = req.body;
    let columns = attributes.map(attr => `${attr.name} ${attr.type}`).join(", ");
    const createTableQuery = `CREATE TABLE ?? (id INT AUTO_INCREMENT PRIMARY KEY, ${columns})`;
    db.query(createTableQuery, [name], (err, result) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.status(201).send({ status: "Entity created successfully", result });
        }
    });
});

app.get('/entities/:name/attributes', (req, res) => {
    const { name } = req.params;
    const describeQuery = `DESCRIBE ??`;
    db.query(describeQuery, [name], (err, results) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            const attributes = results.map(row => ({
                name: row.Field,
                type: row.Type.toUpperCase().includes('INT') ? 'INT' : 'VARCHAR',
            })).filter(attr => attr.name !== 'id'); // Exclude the 'id' column
            res.status(200).send(attributes);
        }
    });
});

app.get('/entities/:name/entries', (req, res) => {
    const { name } = req.params;
    db.query(`SELECT * FROM ??`, [name], (err, results) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.status(200).send(results);
        }
    });
});

app.post('/entities/:name/entries', (req, res) => {
    const { name } = req.params;
    const entry = req.body;
    db.query(`INSERT INTO ?? SET ?`, [name, entry], (err, result) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            db.query(`SELECT * FROM ?? WHERE id = ?`, [name, result.insertId], (err, results) => {
                if (err) {
                    res.status(500).send({ error: err.message });
                } else {
                    res.status(201).send(results[0]);
                }
            });
        }
    });
});

app.put('/entities/:name/entries/:id', (req, res) => {
    const { name, id } = req.params;
    const entry = req.body;
    db.query(`UPDATE ?? SET ? WHERE id = ?`, [name, entry, id], (err, result) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            db.query(`SELECT * FROM ?? WHERE id = ?`, [name, id], (err, results) => {
                if (err) {
                    res.status(500).send({ error: err.message });
                } else {
                    res.status(200).send(results[0]);
                }
            });
        }
    });
});

app.delete('/entities/:name/entries/:id', (req, res) => {
    const { name, id } = req.params;
    db.query(`DELETE FROM ?? WHERE id = ?`, [name, id], (err, result) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.status(204).send();
        }
    });
});

app.listen(8000, () => {
    console.log("Server running on port 8000");
});
