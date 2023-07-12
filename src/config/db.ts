import { Pool } from 'pg';

// DB connection; Config is read from .env file
const pool = new Pool();

export { pool };