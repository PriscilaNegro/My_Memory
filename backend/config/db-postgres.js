import pkg from 'pg';
const { Pool } = pkg;


console.log(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Neon dashboard
  ssl: {
    rejectUnauthorized: false, 
  },
});

//Exporta um método de query reusável
export default {
  query: (text, params) => pool.query(text, params),
};