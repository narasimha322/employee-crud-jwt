const pg = require('pg');

// Pool for employee_management database
const pool = new pg.Pool({
    user: "postgres",
    password: "Nani@123",
    host: "localhost",
    port: 5432,
    database: "employee_authorization"
});

module.exports = pool;
