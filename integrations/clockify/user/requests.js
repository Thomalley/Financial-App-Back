const axios = require('axios');

const url = 'https://api.clockify.me/api/v1';
const key = process.env.CLOCKIFY_MAIN_API_KEY || '';
const workspaceId = process.env.CLOCKIFY_WORKSPACE_ID;
const PATH = 'src/integrations/clockify/user/requests.js';
const FUNC_GET_USER_ID = 'getUserId()';

if (!key) {
  // eslint-disable-next-line no-console
  console.log(
    "API key must be provided through 'CLOCKIFY_MAIN_API_KEY' env variable. Get one at https://clockify.me/user/settings",
  );

  process.exit(1);
}

const getUserId = async (app, developer_email) => {
  const { logger } = app.locals;

  const response = await axios.get(`${url}/workspaces/${workspaceId}/users`, {
    headers: {
      'X-Api-Key': key,
      'Content-Type': 'application/json',
    },
    params: {
      email: developer_email,
    },
  })
    .catch((error) => {
      logger.error(`${PATH}::${FUNC_GET_USER_ID}: ${error.message}`);
    });
  return response.data;
};

module.exports = {
  getUserId,
};
