const mariadb = require('mariadb');
const argon2 = require('argon2');
require('dotenv').config({ quiet: true });

const columns = 'username, firstname, lastname, salary, age, registerday, signintime';

class DbService {
  constructor() {
    this.pool = mariadb.createPool({
      host: process.env.HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE || 'csc4710',
      connectionLimit: 5,
      dateStrings: true,
    });
  }

  static getDbServiceInstance() {
    return this.instance ||= new DbService();
  }

  async execute(sql, values = []) {
    const connection = await this.pool.getConnection();
    try {
      return await connection.execute(sql, values);
    } finally {
      connection.release();
    }
  }

  async register({ username, password, firstname = null, lastname = null, salary = null, age = null }) {
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    await this.execute(
      'INSERT INTO Users (username, password, firstname, lastname, salary, age) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hash, firstname, lastname, salary, age],
    );
    return this.findByUsername(username);
  }

  async signIn(username, password) {
    const [account] = await this.execute('SELECT password FROM Users WHERE username = ?', [username]);
    if (!account || !await argon2.verify(account.password, password)) return null;
    await this.execute('UPDATE Users SET signintime = CURRENT_TIMESTAMP WHERE username = ?', [username]);
    return this.findByUsername(username);
  }

  async findByUsername(username) {
    const [user] = await this.execute(`SELECT ${columns} FROM Users WHERE username = ?`, [username]);
    return user || null;
  }

  searchByName(firstname, lastname) {
    const conditions = [];
    const values = [];
    if (firstname !== undefined) {
      conditions.push('firstname = ?');
      values.push(firstname);
    }
    if (lastname !== undefined) {
      conditions.push('lastname = ?');
      values.push(lastname);
    }
    return this.execute(`SELECT ${columns} FROM Users WHERE ${conditions.join(' AND ')} ORDER BY registerday, username`, values);
  }

  searchBySalary(min, max) {
    return this.execute(`SELECT ${columns} FROM Users WHERE salary BETWEEN ? AND ? ORDER BY salary, username`, [min, max]);
  }

  searchByAge(min, max) {
    return this.execute(`SELECT ${columns} FROM Users WHERE age BETWEEN ? AND ? ORDER BY age, username`, [min, max]);
  }

  registeredAfter(registerday) {
    return this.execute(`SELECT ${columns} FROM Users WHERE registerday > ? ORDER BY registerday, username`, [registerday]);
  }

  neverSignedIn() {
    return this.execute(`SELECT ${columns} FROM Users WHERE signintime IS NULL ORDER BY registerday, username`);
  }

  registeredSameDay(registerday) {
    return this.execute(`SELECT ${columns} FROM Users WHERE registerday >= DATE(?) AND registerday < DATE(?) + INTERVAL 1 DAY ORDER BY registerday, username`, [registerday, registerday]);
  }

  registeredToday() {
    return this.execute(`SELECT ${columns} FROM Users WHERE registerday >= CURRENT_DATE() AND registerday < CURRENT_DATE() + INTERVAL 1 DAY ORDER BY registerday, username`);
  }
}

module.exports = DbService;
