const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();
// const bcrypt = require('bcryptjs');

// Read SQL query script to create tables
const tableScript = fs.readFileSync('db/tables.sql', {
	encoding: 'utf-8'
});

// Generate random password for initial admin user
// const psw = Math.random().toString(36).substring(2);
// console.log("password: ", psw);
// const hash = bcrypt.hashSync(psw, 10);
// const modifiedScript = seedScript.replace('?', hash);

// Connect to database
const pool = new Pool({
	user: 'mohammedshakleya',
	host: 'localhost',
	password: 'mohammedshakleya',
	database: 'testdb',
	port: 5432,
});

(async () => {
	console.log('Running SQL script...');
	const client = await pool.connect();
	try {
	  await client.query(tableScript);
	  console.log('Data inserted successfully!');
	} catch (error) {
	  console.error('Error inserting data:', error);
	} finally {
	  client.release();
	  pool.end();
	}
})();