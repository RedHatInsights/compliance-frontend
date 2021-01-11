/* eslint-disable camelcase */
/* global module */
let default_host;

if (process.env.DEFAULT_HOST) {
    default_host = process.env.DEFAULT_HOST;
} else {
    default_host = 'host.docker.internal';
}

module.exports.default_host = default_host;

/**
 * Place custom webpack dev server config here
 */
const devserverConfig = {};

module.exports.devserverConfig = devserverConfig;
