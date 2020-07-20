/*global module*/

const envWithDefault = function (envVar, defaultVar) {
    return process.env[envVar] ? process.env[envVar] : defaultVar;
};

const defaultHost = function () {
    return envWithDefault('DEFAULT_HOST', 'host.docker.internal');
}

const SECTION = 'insights';
const BETA_SECTION = 'insights';
const APP_ID = 'compliance';

const FRONTEND_PORT = 8002;
const FRONTEND_HOST = envWithDefault('FRONTEND_HOST', defaultHost());

/*
    If you are running the complaince backend locally set LOCAL_API in .env
*/
const LOCAL_API = envWithDefault('LOCAL_API', false);
const API_HOST = envWithDefault('API_HOST', defaultHost());
const API_PORT = envWithDefault('API_PORT', 3000);

const LOCAL_INGRESS = envWithDefault('LOCAL_INGRESS', false);
const INGRESS_HOST = envWithDefault('INGRESS_HOST', defaultHost());
const INGRESS_PORT = envWithDefault('INGRESS_PORT', 8080);

const LOCAL_INVENTORY = envWithDefault('LOCAL_INVENTORY', false);
const INVENTORY_HOST = envWithDefault('INVENTORY_HOST', defaultHost());
const INVENTORY_PORT = envWithDefault('INVENTORY_PORT', 8081);

const routes = {};
routes[`/beta/${BETA_SECTION}/${APP_ID}`] = { host: `http://${FRONTEND_HOST}:${FRONTEND_PORT}` };
routes[`/${SECTION}/${APP_ID}`]      = { host: `http://${FRONTEND_HOST}:${FRONTEND_PORT}` };
routes[`/beta/apps/${APP_ID}`]       = { host: `http://${FRONTEND_HOST}:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`]            = { host: `http://${FRONTEND_HOST}:${FRONTEND_PORT}` };

if (LOCAL_API) {
    routes[`/api/${APP_ID}`] = { host: `http://${API_HOST}:${API_PORT}` };
    routes[`/r/insights/platform/${APP_ID}`] = { host: `http://${API_HOST}:${API_PORT}` };
}

if (LOCAL_INGRESS) {
    routes[`/api/ingress`] = { host: `http://${INGRESS_HOST}:${INGRESS_PORT}` };
}

if (LOCAL_INVENTORY) {
    routes[`/api/inventory/v1/hosts`] = { host: `http://${INVENTORY_HOST}:${INVENTORY_PORT}` };
}

module.exports = { routes };
