// dotenv
require('dotenv').config();

const http = require('http');
const axios = require('axios');
const morgan = require('morgan');
const routes = require('./routes');

const {
  PORT = 5001,
  NODE_ENV = 'development',
} = process.env;

// Configure App
const createApp = require('./app');
const db = require('./models/index');
const pkg = require('./package.json');
const logger = require('./config/logger')(pkg.name, NODE_ENV);

// Database connection
const connectToDatabase = () => {
  if (db) {
    db.sequelize.authenticate()
      .then(() => {
        logger.info('Database connection successful.');
      })
      .catch((err) => {
        logger.error('Database connection failed. Retrying in 3s...');
        logger.error(err);
        setTimeout(connectToDatabase, 3000);
      });
  }
};

// Connect to Database
connectToDatabase();

const app = createApp({
  db,
  logger,
  axios,
});

if (NODE_ENV !== 'production') app.use(morgan('dev'));

// Configure Routes
app.use('/', routes(app));

http.createServer(app);

if (!process.env.SECRET_TOKEN_KEY) {
  logger.error('server: missing JWT env vars');
  process.exit(1);
}

const server = app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    logger.error('Server unable to listen for connections: ', err);
    process.exit(1);
  }

  logger.info('SERVER UP!');
  logger.info(`Port: ${PORT}`);
  logger.info(`Database Name: ${app.locals.db.sequelize.getDatabaseName()}`);
});

// Graceful suhtdown
const exitApp = (signal) => {
  // eslint-disable-next-line
  logger.info(`Shutdown signal: ${signal}`);
  if (app.locals.db && app.locals.db.sequelize) {
    logger.warn(`Closing connection to ${app.locals.db.sequelize.getDatabaseName()} database`);
    app.locals.db.sequelize.close();
  }

  process.exit(0);
};

// Listen for errors
process.on('uncaughtException', (e) => {
  logger.error(e);
  exitApp('SIGTERM');
});

process.on('exit', async (code) => {
  server.close();
  logger.warn(`Exit with code: ${code}`);
});

['SIGHUP', 'SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
    exitApp(signal);
  });
});
