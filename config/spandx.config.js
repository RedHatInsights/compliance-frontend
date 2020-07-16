/*global module*/

const SECTION = 'insights';
const BETA_SECTION = 'insights';
const APP_ID = 'compliance';
const FRONTEND_PORT = 8002;
const API_PORT = 3000;
const routes = {};
const frontendHost = process.env.UI_HOST ? process.env.UI_HOST : 'frontend';

routes[`/beta/${BETA_SECTION}/${APP_ID}`] = { host: `http://${frontendHost}:${FRONTEND_PORT}` };
routes[`/${SECTION}/${APP_ID}`]      = { host: `http://${frontendHost}:${FRONTEND_PORT}` };
routes[`/beta/apps/${APP_ID}`]       = { host: `http://${frontendHost}:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`]            = { host: `http://${frontendHost}:${FRONTEND_PORT}` };

if (process.env.LOCAL_API) {
    routes[`/api/${APP_ID}`] = { host: `http://localhost:${API_PORT}` };
    routes[`/r/insights/platform/${APP_ID}`] = { host: `http://localhost:${API_PORT}` };
}

module.exports = { routes };
