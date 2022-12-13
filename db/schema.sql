DROP DATABASE IF EXISTS lafamilia_db;
CREATE DATABASE lafamilia_db;

USE lafamilia_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL,
    Primary Key(id)
);

CREATE TABLE roles (
    title VARCHAR(30),
    id INT NOT NULL AUTO_INCREMENT,
    department_id INT,
    Primary Key(id),
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
);

CREATE TABLE employees (
    first_name VARCHAR(30) not null,
    last_name VARCHAR(30) not null,
    id INT NOT NULL AUTO_INCREMENT,
    role_id INT,
    salary DECIMAL,
    manager_id INT,
    department_id INT,
    Primary Key(id),
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON DELETE SET NULL
);
