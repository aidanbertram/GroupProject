const express = require('express');
const db = require('./database.js'); 

const app = express();
const port = 3000;

app.get('/content', async (req, res) => {
    try {
        const content = await db.any('SELECT * FROM content');
        res.json(content);
    } catch (err) {
        console.error('Error fetching content:', err);
        res.status(500).send('Failed to retrieve content');
    }
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
