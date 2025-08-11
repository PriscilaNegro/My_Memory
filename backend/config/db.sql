CREATE TABLE users( 
id SERIAL PRIMARY KEY, 
name TEXT not null, 
email TEXT unique not null, 
password TEXT not null, 
created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL);


CREATE TABLE objects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  local TEXT NOT NULL,
  image TEXT, -- optional
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);