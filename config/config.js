require('dotenv').config();

const {
  DB_USERNAME = 'apidb',
  DB_PASSWORD = 'apidb',
  DB_NAME = 'apidb',
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  NODE_ENV = 'development',
} = process.env;

const envConfigs = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'postgres',
    logging: false,
    define: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'postgres',
    logging: false,
    define: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    // dialectOptions: {
    //   ssl: { rejectUnauthorized: false },
    // },
    logging: false,
    define: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
};

module.exports = () => envConfigs[NODE_ENV];
