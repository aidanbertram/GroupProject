const express = require('express');
const db = require('./db');  // Make sure this points to your db.js file

const app = express();

app.get('/', async (req, res) => {
    try {
        const data = await db.any('SELECT * FROM content');  // Adjust SQL query as needed
        res.json(data);
    } catch (err) {
        console.error('Error accessing the database:', err);
        res.status(500).send('Database access error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
