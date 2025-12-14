CREATE DATABASE IF NOT EXISTS marine_catalog;
USE marine_catalog;

CREATE TABLE IF NOT EXISTS parts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  model_number VARCHAR(100) NOT NULL,
  article_number VARCHAR(100) NOT NULL,
  article_name VARCHAR(255) NOT NULL,
  part_name VARCHAR(255) NOT NULL,
  part_pseudo_name VARCHAR(255),
  part_description TEXT,
  part_weight VARCHAR(50),
  part_size VARCHAR(50),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
