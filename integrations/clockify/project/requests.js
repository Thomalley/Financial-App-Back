const axios = require('axios');

const url = 'https://api.clockify.me/api/v1';
const key = process.env.CLOCKIFY_MAIN_API_KEY || '';
const workspaceId = process.env.CLOCKIFY_WORKSPACE_ID;
const PATH = 'src/integrations/clockify/project/requests.js';
const FUNC_GET_PROJECT_ID = 'getProjectId()';

if (!key) {
  // eslint-disable-next-line no-console
  console.log(
    "API key must be provided through 'CLOCKIFY_MAIN_API_KEY' env variable. Get one at https://clockify.me/user/settings",
  );

  process.exit(1);
}

const getProjectId = async (app, client_clockify_id, project_name) => {
  const { logger } = app.locals;

  const response = await axios.get(`${url}/workspaces/${workspaceId}/projects`, {
    headers: {
      'X-Api-Key': key,
      'Content-Type': 'application/json',
    },
    // page-size 1 para que agarre el
    // primero en caso de nombres que contengan otros nombres de proyectos
    params: {
      name: project_name,
      clients: client_clockify_id,
      'page-size': 1,
    },
  })
    .catch((error) => {
      logger.error(`${PATH}::${FUNC_GET_PROJECT_ID}: ${error.message}`);
    });
  return response.data;
};

const getAllProjects = async (app, client_clockify_id) => {
  const { logger } = app.locals;

  const response = await axios.get(`${url}/workspaces/${workspaceId}/projects`, {
    headers: {
      'X-Api-Key': key,
      'Content-Type': 'application/json',
    },
    params: {
      clients: client_clockify_id,
      'page-size': 5000,
    },
  })
    .catch((error) => {
      logger.error(`${PATH}::${FUNC_GET_PROJECT_ID}: ${error.message}`);
    });
  return response.data;
};
module.exports = {
  getProjectId,
  getAllProjects,
};
