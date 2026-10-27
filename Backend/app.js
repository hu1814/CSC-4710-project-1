const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const DbService = require('./dbService');

const user = { $ref: '#/components/schemas/User' };
const error = { description: 'Request failed', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } };
const userResponse = { description: 'User information (password excluded)', content: { 'application/json': { schema: { type: 'object', properties: { data: user } } } } };
const listResponse = { description: 'Matching users; an empty array when none match', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: user } } } } } };
const searchResponses = { 200: listResponse, 400: error, 500: error };
const username = { name: 'username', in: 'path', required: true, schema: { type: 'string', minLength: 1, maxLength: 50 }, example: 'alice' };
const credentialProperties = {
  username: { type: 'string', minLength: 1, maxLength: 50, example: 'alice' },
  password: { type: 'string', format: 'password', minLength: 1, maxLength: 1024, writeOnly: true, example: 'TestPassword123!' },
};

const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'CSC4710 Users API',
    version: '1.0.0',
    description: 'Register and authenticate users, then search their public fields. Sign-in verifies credentials and records the latest successful sign-in; it does not issue a session or token. Searches are public. Dates use the MariaDB session time zone. Name matching follows the database collation.',
  },
  paths: {
    '/users/register': {
      post: {
        summary: 'Register a user',
        description: 'Passwords require 8–1024 characters and are stored as Argon2id hashes. Other profile fields are optional or null. Registration and sign-in timestamps are set by the server.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: {
            type: 'object', required: ['username', 'password'],
            properties: {
              ...credentialProperties,
              password: { ...credentialProperties.password, minLength: 8 },
              firstname: { type: 'string', nullable: true, minLength: 1, maxLength: 50, example: 'Alice' },
              lastname: { type: 'string', nullable: true, minLength: 1, maxLength: 50, example: 'Smith' },
              salary: { type: 'number', nullable: true, minimum: -99999999.99, maximum: 99999999.99, multipleOf: 0.01, example: 65000, description: 'Also accepts an exact decimal string, such as "65000.00".' },
              age: { type: 'integer', nullable: true, minimum: 0, maximum: 2147483647, example: 30 },
            },
          } } },
        },
        responses: { 201: userResponse, 400: error, 409: { ...error, description: 'Username already exists' }, 500: error },
      },
    },
    '/users/sign-in': {
      post: {
        summary: 'Sign in and update the latest successful sign-in time',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['username', 'password'], properties: credentialProperties } } } },
        responses: { 200: userResponse, 400: error, 401: { ...error, description: 'Invalid username or password' }, 500: error },
      },
    },
    '/users/search/name': {
      get: {
        summary: 'Search by first name, last name, or both',
        description: 'Provide at least one name. When both are supplied, both must match. Uses equality rather than substring matching.',
        parameters: [
          { name: 'firstname', in: 'query', schema: { type: 'string', minLength: 1, maxLength: 50 }, example: 'Alice' },
          { name: 'lastname', in: 'query', schema: { type: 'string', minLength: 1, maxLength: 50 }, example: 'Smith' },
        ],
        responses: searchResponses,
      },
    },
    '/users/search/salary': {
      get: {
        summary: 'Search by an inclusive salary range',
        parameters: [
          { name: 'min', in: 'query', required: true, schema: { type: 'number', minimum: -99999999.99, maximum: 99999999.99, multipleOf: 0.01 }, example: 50000 },
          { name: 'max', in: 'query', required: true, schema: { type: 'number', minimum: -99999999.99, maximum: 99999999.99, multipleOf: 0.01 }, example: 75000 },
        ],
        responses: searchResponses,
      },
    },
    '/users/search/age': {
      get: {
        summary: 'Search by an inclusive age range',
        parameters: [
          { name: 'min', in: 'query', required: true, schema: { type: 'integer', minimum: 0, maximum: 2147483647 }, example: 20 },
          { name: 'max', in: 'query', required: true, schema: { type: 'integer', minimum: 0, maximum: 2147483647 }, example: 40 },
        ],
        responses: searchResponses,
      },
    },
    '/users/registered-after/{username}': {
      get: {
        summary: 'Find users registered after a specified user',
        description: 'Strictly compares registerday timestamps. Tied timestamps are excluded because the schema has no sequential registration ID. Returns an empty array if the reference user has a null registration date.',
        parameters: [username],
        responses: { ...searchResponses, 404: error },
      },
    },
    '/users/never-signed-in': {
      get: { summary: 'Find users who have never successfully signed in', responses: { 200: listResponse, 500: error } },
    },
    '/users/registered-same-day/{username}': {
      get: {
        summary: 'Find users registered on the same calendar day as a specified user',
        description: 'Includes the reference user. Returns an empty array if the reference user has a null registration date.',
        parameters: [username],
        responses: { ...searchResponses, 404: error },
      },
    },
    '/users/registered-today': {
      get: { summary: 'Find users registered today (MariaDB session time zone)', responses: { 200: listResponse, 500: error } },
    },
    '/users/by-username/{username}': {
      get: { summary: 'Find a user by their unique username', parameters: [username], responses: { 200: userResponse, 400: error, 404: error, 500: error } },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          username: { type: 'string', example: 'alice' },
          firstname: { type: 'string', nullable: true },
          lastname: { type: 'string', nullable: true },
          salary: { type: 'string', nullable: true, example: '65000.00', description: 'Decimal string to preserve exact precision' },
          age: { type: 'integer', nullable: true },
          registerday: { type: 'string', nullable: true, example: '2026-10-27 10:30:00', description: 'Database-local DATETIME, without a UTC offset' },
          signintime: { type: 'string', nullable: true, example: null },
        },
      },
      Error: { type: 'object', properties: { error: { type: 'string' } }, required: ['error'] },
    },
  },
};

const app = express();
const db = DbService.getDbServiceInstance();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '16kb' }));
app.get('/', (req, res) => res.redirect('/api-docs/'));
app.get('/openapi.json', (req, res) => res.json(openapi));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));

function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

function text(value, name, max = 50) {
  if (typeof value !== 'string' || !value.trim() || [...value].length > max) {
    throw badRequest(`${name} must be a nonempty string of at most ${max} characters`);
  }
  return value;
}

function salary(value, name) {
  if (!['string', 'number'].includes(typeof value) || !/^-?\d{1,8}(\.\d{1,2})?$/.test(String(value))) {
    throw badRequest(`${name} must be a decimal between -99999999.99 and 99999999.99 with at most two decimal places`);
  }
  return value;
}

function age(value, name, fromQuery = false) {
  if (fromQuery && typeof value === 'string' && /^\d+$/.test(value)) value = Number(value);
  if (!Number.isInteger(value) || value < 0 || value > 2147483647) {
    throw badRequest(`${name} must be an integer between 0 and 2147483647`);
  }
  return value;
}

function credentials(body, registering = false) {
  if (!body || Array.isArray(body) || typeof body !== 'object') throw badRequest('A JSON object is required');
  text(body.username, 'username');
  text(body.password, 'password', 1024);
  if (registering && [...body.password].length < 8) throw badRequest('password must contain at least 8 characters');
}

async function referenceUser(username) {
  const user = await db.findByUsername(text(username, 'username'));
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  return user;
}

app.post('/users/register', async (req, res) => {
  credentials(req.body, true);
  for (const field of ['firstname', 'lastname']) {
    if (req.body[field] != null) text(req.body[field], field);
  }
  if (req.body.salary != null) salary(req.body.salary, 'salary');
  if (req.body.age != null) age(req.body.age, 'age');
  res.status(201).json({ data: await db.register(req.body) });
});

app.post('/users/sign-in', async (req, res) => {
  credentials(req.body);
  const user = await db.signIn(req.body.username, req.body.password);
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });
  res.json({ data: user });
});

app.get('/users/search/name', async (req, res) => {
  const { firstname, lastname } = req.query;
  if (firstname === undefined && lastname === undefined) throw badRequest('Provide firstname, lastname, or both');
  if (firstname !== undefined) text(firstname, 'firstname');
  if (lastname !== undefined) text(lastname, 'lastname');
  res.json({ data: await db.searchByName(firstname, lastname) });
});

app.get('/users/search/salary', async (req, res) => {
  const min = salary(req.query.min, 'min');
  const max = salary(req.query.max, 'max');
  if (Number(min) > Number(max)) throw badRequest('min must be less than or equal to max');
  res.json({ data: await db.searchBySalary(min, max) });
});

app.get('/users/search/age', async (req, res) => {
  const min = age(req.query.min, 'min', true);
  const max = age(req.query.max, 'max', true);
  if (min > max) throw badRequest('min must be less than or equal to max');
  res.json({ data: await db.searchByAge(min, max) });
});

app.get('/users/registered-after/:username', async (req, res) => {
  const user = await referenceUser(req.params.username);
  res.json({ data: user.registerday === null ? [] : await db.registeredAfter(user.registerday) });
});

app.get('/users/never-signed-in', async (req, res) => {
  res.json({ data: await db.neverSignedIn() });
});

app.get('/users/registered-same-day/:username', async (req, res) => {
  const user = await referenceUser(req.params.username);
  res.json({ data: user.registerday === null ? [] : await db.registeredSameDay(user.registerday) });
});

app.get('/users/registered-today', async (req, res) => {
  res.json({ data: await db.registeredToday() });
});

app.get('/users/by-username/:username', async (req, res) => {
  res.json({ data: await referenceUser(req.params.username) });
});

app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));
app.use((err, req, res, next) => {
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Username already exists' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' });
  if (err.status === 413) return res.status(413).json({ error: 'Request body too large' });
  if (err.status === 400 || err.status === 404) return res.status(err.status).json({ error: err.message });
  console.error('Request failed:', err.code || err.name);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  (async () => {
    await db.execute('SELECT username FROM Users LIMIT 0');
    const port = Number(process.env.PORT || 5050);
    app.listen(port, process.env.APP_HOST || '127.0.0.1', () => {
      console.log(`Swagger UI: http://localhost:${port}/api-docs/`);
    });
  })().catch(async (err) => {
    console.error('Database startup failed:', err.code || err.name);
    await db.pool.end();
    process.exitCode = 1;
  });
}

module.exports = app;
