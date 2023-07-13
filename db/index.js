const { Pool } = require('pg');
const fs = require('fs');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Read SQL tables
const tableScript = fs.readFileSync('db/tables.sql', {
	encoding: 'utf-8'
});

// Read SQL seed
const seedScript = fs.readFileSync('db/seed.sql', {
	encoding: 'utf-8'
});

// Generate random password for initial admin user
const psw = Math.random().toString(36).substring(2);
const hash = bcrypt.hashSync(psw, 10);

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
	  await client.query(seedScript, [hash]);
	  console.log('Data inserted successfully!\n');
	} catch (error) {
	  console.error('Error inserting data:', error);
	} finally {
	  // Output login credentials
	  console.log("email: admin@admin.com")
	  console.log("password:", psw);
	  client.release();
	  pool.end();
	}
})();