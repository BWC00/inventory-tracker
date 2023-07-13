/*
  ##### Database seeding #####
*/
WITH
/* Insert user roles */
A AS (INSERT INTO roles (name) VALUES ('admin') RETURNING *),
B AS (INSERT INTO roles (name) VALUES ('counter')),
/* Insert admin account */
C AS (INSERT INTO users (email, password, role_id) VALUES	('admin@admin.com', $1, (SELECT id FROM A WHERE name='admin')))
SELECT * FROM users;
