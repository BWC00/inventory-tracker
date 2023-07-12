
/*
  ##### Database seeding #####
  Run the following command after all tables were created:
  'npm run seed'
*/

/* Insert user roles */
INSERT INTO roles (name)
VALUES	('admin'),
				('counter');

SET @admin_role_id = (SELECT id FROM roles WHERE name = 'admin');

/* Insert admin account */
INSERT INTO users (email, password, role_id)
VALUES	('admin@email.com', ?, @admin_role_id);
