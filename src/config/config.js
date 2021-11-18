export default {
  development: {
    username: 'postgres',
    password: 'enthusiast',
    database: 'node-project',
    host: '127.0.0.1',
    port: '5434',
    dialect: 'postgres',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
};
