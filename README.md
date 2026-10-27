# CSC-4710 Project 1 – User Registration and Database Management

## Project Overview

This project focuses on developing a database-driven web application that allows users to register, sign in, and search for user information using various criteria. The application connects a web-based frontend to a MySQL database through a Node.js and Express backend.

The project demonstrates full-stack web development, database management, secure authentication, SQL queries, and collaborative development using Git and GitHub.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Web Server:** Apache (XAMPP)
- **Database Management:** phpMyAdmin
- **Version Control:** Git and GitHub
- **Additional Packages:** mysql, cors, dotenv, nodemon

## Project Features

The application is designed to support the following functionality:

1. **User Registration:** Allow new users to create an account and store their information in the database.
2. **User Sign-In:** Authenticate registered users using secure database queries that prevent SQL injection.
3. **Search by Name:** Find users by their first name, last name, or both.
4. **Search by User ID:** Retrieve a user's information using their unique username.
5. **Search by Salary:** Find users whose salaries fall between two specified values.
6. **Search by Age:** Find users whose ages fall within a specified range.
7. **Search by Registration Order:** Find users who registered after a specified user.
8. **Search by Sign-In History:** Retrieve users who have never signed in.
9. **Search by Registration Date:** Find users who registered on the same day as a specified user.
10. **Search Today's Registrations:** Retrieve all users who registered on the current date.

These are the project's required features. Their implementation and results will be verified during development and testing.

## Database Structure

The application uses a MySQL database named `web_app` containing a `Users` table.

The proposed table structure is:

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

The `username` field serves as the unique identifier for each user. Passwords should be securely hashed before being stored in the database.

The `registerday` field records when a user registers, while `signintime` stores the user's most recent successful sign-in. A `NULL` sign-in time indicates that the user has never signed in.

Using `DATETIME` for registration allows users to be compared by registration order as well as registration date.

## Installation and Setup

### Prerequisites

Before running the application, install:

- Node.js
- XAMPP
- Git

### 1. Clone the Repository

Open a terminal in your XAMPP `htdocs` directory and run:

```bash
git clone https://github.com/hu1814/CSC-4710-project-1.git
```

Navigate into the project directory:

```bash
cd CSC-4710-project-1
```

### 2. Configure MySQL

1. Open the XAMPP Control Panel.
2. Start Apache and MySQL.
3. Navigate to `http://localhost/phpmyadmin/`.
4. Create a database named `web_app`.
5. Create the `Users` table using the SQL statement provided above.

### 3. Configure Environment Variables

Navigate to the backend folder and rename `dotenv` to `.env`, or create a `.env` file if one does not already exist.

Example configuration:

```env
PORT=5050
DB_USER=root
PASSWORD=
DATABASE=web_app
DB_PORT=3306
HOST=localhost
```

Update the database credentials to match your local MySQL configuration.

**Security Note:** The `.env` file should not be committed to GitHub because it may contain sensitive database credentials.

### 4. Install Backend Dependencies

Navigate to the backend directory:

```bash
cd Backend
```

Install the required packages:

```bash
npm install
```

If dependencies have not yet been configured, install the packages needed by the application:

```bash
npm install express mysql cors dotenv
npm install --save-dev nodemon
```

### 5. Start the Backend Server

Run:

```bash
npm start
```

The backend is configured to run at:

`http://localhost:5050`

Ensure the `start` script in `package.json` points to the correct backend entry file.

### 6. Open the Frontend

Start Apache using XAMPP and open the application's frontend `index.html` file through `http://localhost/`.

The exact URL depends on the final folder structure.

## Application Architecture

The application follows a three-layer structure:

### Frontend (HTML, CSS, JavaScript)

Provides the user interface for registration, sign-in, and database searches. JavaScript uses the Fetch API to communicate with the backend.

### Backend (Node.js and Express)

Handles HTTP requests, validates user input, processes registration and sign-in operations, and communicates with the database service.

### Database (MySQL)

Stores registered user records, authentication information, salary, age, registration timestamps, and sign-in history.

## SQL Injection Prevention

The application should use parameterized SQL queries to prevent user input from being interpreted as SQL commands.

For example:

```javascript
const query = "SELECT * FROM Users WHERE username = ?";

connection.query(query, [username], (err, results) => {
    // Process the results
});
```

Passwords should be verified using secure password hashing rather than comparing plaintext passwords.

Password hashes should never be returned in user search results.

## SQL Queries

All SQL statements used for creating tables, registering users, updating sign-in information, and performing the required searches will be included in the `sql.txt` file.

This file is a required project deliverable.

## Git and GitHub Collaboration

The project also demonstrates collaborative software development using Git and GitHub.

The required operations include:

- **Clone:** Copy the remote repository to a local computer.
- **Fetch:** Retrieve remote updates without immediately merging them.
- **Pull:** Download and integrate changes from the remote repository.
- **Add:** Stage modified files for a commit.
- **Commit:** Record changes in the local repository.
- **Push:** Upload local commits to the remote repository.

Team members will use these operations to collaborate, manage source code, and track project development.

## Project Demonstration

A video demonstration will be prepared to explain the application's functionality and show the results of the required SQL queries.

The demonstration will cover user registration, authentication, database searches, and Git/GitHub operations.

## Project Deliverables

- Functional web application
- MySQL `Users` table
- User registration and sign-in features
- Required database search functionality
- `sql.txt` containing SQL statements
- GitHub repository demonstrating collaboration
- Video demonstration of the application and Git operations

## References

- [Original Sample Project](https://github.com/shiyonglu/database_javascript)
- [Node.js Examples](https://github.com/shiyonglu/database_javascript/tree/main/nodejs_examples)
- [React Examples](https://github.com/shiyonglu/database_javascript/tree/main/react_examples)
- [SQL Injection Reference](https://portswigger.net/support/using-sql-injection-to-bypass-authentication)

## Course Information

**Course:** CSC-4710

**Project:** Project 1 – User Registration and Database Management

**Repository:** [hu1814/CSC-4710-project-1](https://github.com/hu1814/CSC-4710-project-1)
