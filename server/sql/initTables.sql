CREATE DATABASE centcom;

USE centcom;

CREATE TABLE servers (name VARCHAR(50), url VARCHAR(100), description VARCHAR(200));

CREATE TABLE config (id VARCHAR(50) UNIQUE, value VARCHAR(200));