CREATE DATABASE centcom;

USE centcom;

CREATE TABLE servers (name VARCHAR(50), url VARCHAR(100), description VARCHAR(200), access_level VARCHAR(20));

CREATE TABLE config (cfg_key VARCHAR(50) UNIQUE, cfg_value VARCHAR(200));