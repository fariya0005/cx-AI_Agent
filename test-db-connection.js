const mysql = require('mysql');

// Replace these with your actual database credentials
const DB_PASS = 'Fariya@3281';
const DB_NAME = 'dialogflow_data';

const connection = mysql.createConnection({
    host: '34.57.175.51',  // Public IP address of your Cloud SQL instance
    user: 'root',
    password: DB_PASS,     // The password for the root user
    database: DB_NAME,
    port: 3306             // Default MySQL port
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected to database!');
});
