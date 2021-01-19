/* eslint-disable camelcase */
/* global module */
let default_host;

if (process.env.DEFAULT_HOST) {
    default_host = process.env.DEFAULT_HOST;
} else {
    default_host = 'host.docker.internal';
}

module.exports.default_host = default_host;

const hotReload = function () {
    return process.env.HOT_RELOAD && process.env.HOT_RELOAD === 'true' ? true : false;
};

/**
 * Place custom webpack dev server config here
 */
const devserverConfig = {
    serveIndex: false,
    liveReload: hotReload(),
    hot: hotReload(),
    injectClient: hotReload(),
    inline: hotReload(),
    allowedHosts: [
        'ci.foo.redhat.com',
        'qa.foo.redhat.com',
        'stage.foo.redhat.com',
        'prod.foo.redhat.com',
        default_host
    ]
};

module.exports.devserverConfig = devserverConfig;
