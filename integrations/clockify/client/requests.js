const axios = require('axios');

const url = 'https://api.clockify.me/api/v1';
const key = process.env.CLOCKIFY_MAIN_API_KEY || '';
const workspaceId = process.env.CLOCKIFY_WORKSPACE_ID;
const PATH = 'src/integrations/clockify/client/requests.js';
const FUNC_GET_CLIENT_ID = 'getClientId()';

if (!key) {
  // eslint-disable-next-line no-console
  console.log(
    "API key must be provided through 'CLOCKIFY_MAIN_API_KEY' env variable. Get one at https://clockify.me/user/settings",
  );

  process.exit(1);
}

const getClientId = async (app, client_name) => {
  const { logger } = app.locals;

  const response = await axios.get(`${url}/workspaces/${workspaceId}/clients`, {
    headers: {
      'X-Api-Key': key,
      'Content-Type': 'application/json',
    },
    params: {
      name: client_name,
      'page-size': 5000,
    },
  })
    .catch((error) => {
      logger.error(`${PATH}::${FUNC_GET_CLIENT_ID}: ${error.message}`);
    });
  return response.data;
};

module.exports = {
  getClientId,
};
