-- Finance Data Processing and Access Control System Schema

-- Create Database (Optional - can be run manually if needed)
-- CREATE DATABASE finance_dashboard;
-- USE finance_dashboard;

-- 1. Roles Table
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

-- Insert Default Roles
INSERT INTO roles (role_name) VALUES ('Admin'), ('Analyst'), ('Viewer');

-- 2. Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Insert Initial Admin User (Password: admin123)
-- Hash: $2a$10$X7lC.kZ7z9X7lC.kZ7z9X.kZ7z9X7lC.kZ7z9X.kZ7z9X7lC.kZ7z9X.kZ7z9X7lC (Just a placeholder, backend will handle salt)
-- For demonstration, password will be hashed by backend during registration.
-- However, let's provide a script for manual seed if needed.

-- 3. Transactions Table
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type ENUM('Income', 'Expense') NOT NULL,
    category VARCHAR(100) NOT NULL,
    transaction_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Sample Data
-- Insert a test user (Admin, password will be 'admin123' after backend hashing)
INSERT INTO users (username, email, password_hash, role_id, status) VALUES ('admin_user', 'admin@example.com', 'admin_placeholder', 1, 'Active');

-- Sample category-wise totals for analytics
INSERT INTO transactions (user_id, amount, type, category, transaction_date, notes) VALUES 
(1, 5000.00, 'Income', 'Salary', '2026-04-01', 'Monthly salary'),
(1, 1200.00, 'Expense', 'Rent', '2026-04-02', 'April rent'),
(1, 450.00, 'Expense', 'Groceries', '2026-04-03', 'Weekly groceries'),
(1, 1500.00, 'Income', 'Freelance', '2026-04-04', 'Web project bonus'),
(1, 200.00, 'Expense', 'Utilities', '2026-04-05', 'Electricity bill');
