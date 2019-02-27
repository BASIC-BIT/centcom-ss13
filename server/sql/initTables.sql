CREATE DATABASE centcom;

USE centcom;

CREATE TABLE servers (name VARCHAR(50), url VARCHAR(100), port INT, access_level VARCHAR(20));

CREATE TABLE config (cfg_key VARCHAR(50) UNIQUE NOT NULL, cfg_value VARCHAR(200) NOT NULL);

CREATE TABLE book_categories (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(6)
);

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(100) NOT NULL,
    content VARCHAR(2000),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES book_categories(id)
);

CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(100)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nickname VARCHAR(100),
    email VARCHAR(100),
    byond_key VARCHAR(100)
);