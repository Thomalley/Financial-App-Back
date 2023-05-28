const axios = require('axios');

const url = 'https://api.clockify.me/api/v1';
const key = process.env.CLOCKIFY_MAIN_API_KEY || '';
const workspaceId = process.env.CLOCKIFY_WORKSPACE_ID;
const PATH = 'src/integrations/clockify/timeEntry/requests.js';
const FUNC_GET_TIME_ENTRY = 'getTimeEntry()';

if (!key) {
  // eslint-disable-next-line no-console
  console.log(
    "API key must be provided through 'CLOCKIFY_MAIN_API_KEY' env variable. Get one at https://clockify.me/user/settings",
  );

  process.exit(1);
}

const getTimeEntry = async ({
  app, start_time, end_time, user_clockify_id, project_clockify_id,
}) => {
  const { logger } = app.locals;

  const response = await axios.get(`${url}/workspaces/${workspaceId}/user/${user_clockify_id}/time-entries`, {
    headers: {
      'X-Api-Key': key,
      'Content-Type': 'application/json',
    },
    // una pagina de 5000 time entrys por mes max
    params: {
      start: start_time,
      end: end_time,
      project: project_clockify_id,
      'page-size': 5000,
      'in-progress': false,
    },
  })
    .catch((error) => {
      logger.error(`${PATH}::${FUNC_GET_TIME_ENTRY}: ${error.message}`);
    });

  return response.data;
};

module.exports = {
  getTimeEntry,
};
