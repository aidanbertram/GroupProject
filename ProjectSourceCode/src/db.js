const pgp = require('pg-promise')();
const db = pgp({
    host: 'db',  // Use the service name defined in docker-compose.yml
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
});

module.exports = db;
