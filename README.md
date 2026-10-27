# CSC-4710 Project 1 - User Registration and Database Management

## Project Overview

This project is a database-driven web application that allows users to register, sign in, and search for user information using different criteria.

The application uses HTML, CSS, and JavaScript for the frontend, Node.js and Express for the backend, and MySQL for the database.

The project implements all 10 required features and demonstrates database management, secure authentication, SQL queries, and collaboration using Git and GitHub.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Database Connector:** MariaDB Node.js Connector
- **Security:** Argon2id password hashing and parameterized SQL queries
- **API Documentation:** Swagger UI
- **Version Control:** Git and GitHub

## Project Features

The application implements the following 10 requirements:

1. **User Registration:** Create an account and store user information in the database.
2. **User Sign-In:** Authenticate users and update their latest sign-in timestamp.
3. **Search by Name:** Search users by first name, last name, or both.
4. **Search by Username:** Retrieve a user using their unique username.
5. **Search by Salary:** Find users whose salaries fall within a specified range.
6. **Search by Age:** Find users whose ages fall within a specified range.
7. **Search by Registration Order:** Find users who registered after a specified user.
8. **Search by Sign-In History:** Find users who have never signed in.
9. **Search by Registration Date:** Find users registered on the same day as another user.
10. **Search Today's Registrations:** Find users who registered today.

## Project Structure

```text
CSC-4710-project-1/
├── Frontend/
│   ├── index.html
│   ├── index.js
│   └── stylesheet.css
├── Backend/
│   ├── app.js
│   ├── dbService.js
│   ├── package.json
│   └── .env.example
├── sql/
│   └── init.sql
├── sql.txt
└── README.md
```

- **index.html:** Defines the website's structure and forms.
- **stylesheet.css:** Controls the website's appearance.
- **index.js:** Handles user interactions, API requests, and search results.
- **app.js:** Defines the backend API endpoints and handles requests.
- **dbService.js:** Handles database connections and SQL queries.
- **init.sql:** Contains the Users table creation statement.
- **sql.txt:** Documents the SQL statements used in the project.

## Database Structure

The application uses a MySQL database containing a `Users` table.

```sql
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
```

The username uniquely identifies each user. Passwords are stored as Argon2id hashes.

The `registerday` field records when an account is created, while `signintime` records the most recent successful sign-in.

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/hu1814/CSC-4710-project-1.git
cd CSC-4710-project-1
```

### 2. Configure MySQL

Start MySQL and create the database:

```sql
CREATE DATABASE IF NOT EXISTS csc4710;
USE csc4710;
```

Run the SQL statement in `sql/init.sql` to create the Users table.

MySQL Server can be installed directly, or a compatible database server can be provided through XAMPP.

### 3. Configure the Backend

Navigate to the `Backend` folder and copy `.env.example` to a new file named `.env`.

Update the database credentials:

```env
PORT=5050
APP_HOST=127.0.0.1
DB_USER=root
PASSWORD=your_mysql_password
DATABASE=csc4710
DB_PORT=3306
HOST=127.0.0.1
```

The database username, password, and database name must match your local MySQL configuration.

**Do not upload the `.env` file to GitHub.**

### 4. Install Dependencies and Start the Backend

From the project root:

```bash
cd Backend
npm install
npm run dev
```

The backend runs at `http://localhost:5050`.

### 5. Open the Frontend

Open `Frontend/index.html` in a web browser.

Make sure MySQL and the backend are running before using the application.

Apache and XAMPP are not required when using an existing MySQL installation.

## Security

The application includes:

- **Argon2id password hashing** to securely store passwords.
- **Parameterized SQL queries** to help prevent SQL injection.
- **Input validation** to reject invalid registration and search requests.
- **Password protection** to prevent password hashes from appearing in search results.

## API Documentation

The backend includes Swagger UI for viewing and testing API endpoints.

After starting the backend, open:

`http://localhost:5050/api-docs/`

Swagger provides documentation for registration, sign-in, and all eight search functions.

## Testing

The application was manually tested using a locally running Node.js backend and MySQL database.

All 10 required features passed manual testing on a local Windows computer using Node.js and MySQL.

The frontend successfully communicates with the backend, and the backend retrieves and stores information in MySQL.

## Git and GitHub Collaboration

Git and GitHub are used to manage the project and coordinate development.

The project demonstrates the following operations:

- `git clone` — Clone the repository.
- `git fetch` — Retrieve remote updates.
- `git pull` — Download and integrate changes.
- `git add` — Stage changes.
- `git commit` — Save changes locally.
- `git push` — Upload commits to GitHub.

The shared repository contains the frontend, backend, SQL statements, and project documentation.

## Project Deliverables

- Functional frontend and backend
- MySQL Users table
- User registration and sign-in
- All eight required search functions
- `sql.txt` containing SQL statements
- GitHub repository with project files
- Video demonstration of application functionality and Git operations

## Course Information

**Course:** CSC-4710  
**Project:** Project 1 - User Registration and Database Management  
**Repository:** https://github.com/hu1814/CSC-4710-project-1
