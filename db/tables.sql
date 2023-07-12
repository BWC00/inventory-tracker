
-- Role table
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

-- User table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE NO ACTION
);

-- Category table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

-- Subproduct table
CREATE TABLE IF NOT EXISTS subproducts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

-- Product table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category_id INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE NO ACTION
);

-- Product subproduct table
CREATE TABLE IF NOT EXISTS product_subproducts (
  product_id INTEGER NOT NULL,
  subproduct_id INTEGER PRIMARY KEY,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (subproduct_id) REFERENCES subproducts(id) ON DELETE CASCADE
);

-- Barcode scanner table
CREATE TABLE IF NOT EXISTS barcode_scanners (
  id SERIAL PRIMARY KEY,
  subproduct_id INTEGER NOT NULL,
  barcode VARCHAR(255) NOT NULL,
  FOREIGN KEY (subproduct_id) REFERENCES subproducts(id) ON DELETE CASCADE
);

-- CountPlan table
CREATE TABLE IF NOT EXISTS count_plans (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER,
  repetition_schedule VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- CountPlanUser table
CREATE TABLE IF NOT EXISTS count_plan_users (
  count_plan_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  PRIMARY KEY (count_plan_id, user_id),
  FOREIGN KEY (count_plan_id) REFERENCES count_plans(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- CountExecution table
CREATE TABLE IF NOT EXISTS count_executions (
  id SERIAL PRIMARY KEY,
  count_plan_id INTEGER,
  status VARCHAR(255) CHECK (status IN ('ongoing', 'end')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (count_plan_id) REFERENCES count_plans(id) ON DELETE SET NULL
);

-- UserProductCount table
CREATE TABLE IF NOT EXISTS user_product_counts (
  id SERIAL PRIMARY KEY,
  count_execution_id INTEGER NOT NULL,
  subproduct_id INTEGER NOT NULL,
  user_id INTEGER,
  quantity INTEGER CHECK (quantity >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (count_execution_id) REFERENCES count_executions(id) ON DELETE CASCADE,
  FOREIGN KEY (subproduct_id) REFERENCES subproducts(id) ON DELETE NO ACTION,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- users table
CREATE INDEX IF NOT EXISTS idx_users_id ON users (id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- products table
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);

-- product_subproducts table
CREATE INDEX IF NOT EXISTS idx_product_subproducts_product_id ON product_subproducts (product_id);
CREATE INDEX IF NOT EXISTS idx_product_subproducts_subproduct_id ON product_subproducts (subproduct_id);

-- barcode_scanners table
CREATE INDEX IF NOT EXISTS idx_barcode_scanners_subproduct_id ON barcode_scanners (subproduct_id);

-- count_plans table
CREATE INDEX IF NOT EXISTS idx_count_plans_owner_id ON count_plans (owner_id);

-- count_plan_users table
CREATE INDEX IF NOT EXISTS idx_count_plan_users_count_plan_id ON count_plan_users (count_plan_id);
CREATE INDEX IF NOT EXISTS idx_count_plan_users_user_id ON count_plan_users (user_id);

-- count_executions table
CREATE INDEX IF NOT EXISTS idx_count_executions_count_plan_id ON count_executions (count_plan_id);

-- user_product_counts table
CREATE INDEX IF NOT EXISTS idx_user_product_counts_count_execution_id ON user_product_counts (count_execution_id);
CREATE INDEX IF NOT EXISTS idx_user_product_counts_subproduct_id ON user_product_counts (subproduct_id);
CREATE INDEX IF NOT EXISTS idx_user_product_counts_user_id ON user_product_counts (user_id);


-- ProductCategory table
-- CREATE TABLE product_categories (
--   product_id INTEGER NOT NULL,
--   category_id INTEGER NOT NULL,
--   PRIMARY KEY (product_id, category_id),
--   FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
--   FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
-- );

-- CREATE OR REPLACE FUNCTION rec_insert()
--   RETURNS trigger AS
-- $$
-- BEGIN
--         VALUES(NEW.product_id, NEW.category_id);
 
--     RETURN NEW;
-- END;
-- $$
-- LANGUAGE 'plpgsql';

-- Create Trigger to insert into product_categories
-- CREATE TRIGGER ins_same_rec
--   AFTER INSERT ON products
--   FOR EACH ROW
--   EXECUTE PROCEDURE rec_insert();
  -- Insert into product_categories using the inserted product_id and category_id from the products table