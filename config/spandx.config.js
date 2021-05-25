/*global module*/

// eslint-disable-next-line @typescript-eslint/no-var-requires
const goodGuyLib = require('good-guy-http');

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

const LOCAL_REMEDIATIONS = envWithDefault('LOCAL_REMEDIATIONS', false);
const REMEDIATIONS_HOST = envWithDefault('REMEDIATIONS_HOST', defaultHost());
const REMEDIATIONS_PORT = envWithDefault('REMEDIATIONS_PORT', 9002);
const GOOD_GUY = envWithDefault('GOOD_GUY', false);

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

if (LOCAL_REMEDIATIONS) {
    routes[`/api/remediations/`] = { host: `http://${REMEDIATIONS_HOST}:${REMEDIATIONS_PORT}` };
}

const esi = {
    // Increases the default (2s) timeout which can be a pain sometimes.
    // https://github.com/Schibsted-Tech-Polska/good-guy-http/blob/master/lib/index.js#L55
    httpClient: goodGuyLib({
        timeout: 5000
    })
};

module.exports = {
    routes,
    ...GOOD_GUY && { esi }
};
