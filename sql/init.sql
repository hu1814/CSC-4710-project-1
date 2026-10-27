CREATE TABLE Users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    salary DECIMAL(10,2),
    age INTEGER,
    registerday DATETIME DEFAULT CURRENT_TIMESTAMP,
    signintime DATETIME NULL
);
