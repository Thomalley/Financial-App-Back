const axios = require('axios');

const url = 'https://api.notion.com/v1';
const notionVersion = process.env.NOTION_VERSION;
const token = process.env.NOTION_INTERNAL_INTEGRATION_TOKEN || '';
const PATH = 'src/integrations/notion/requests.js';
const FUNC_GET_USER_ID = 'getNotionUserId()';

if (!token) {
  // eslint-disable-next-line no-console
  console.log(
    "API token must be provided through 'NOTION_INTERNAL_INTEGRATION_TOKEN' env variable. Get one at https://www.notion.so/my-integrations",
  );

  process.exit(1);
}

const getNotionUserId = async (app, developer_email) => {
  const { logger } = app.locals;

  const response = await axios.get(`${url}/users`, {
    headers: {
      'Notion-Version': `${notionVersion}`,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .catch((error) => {
      logger.error(`${PATH}::${FUNC_GET_USER_ID}: ${error.message}`);
    });

  let user;
  if (response.data) {
    user = response.data.results.find((r) => r.type === 'person' && r.person.email === developer_email);
  }
  return user;
};

module.exports = {
  getNotionUserId,
};
