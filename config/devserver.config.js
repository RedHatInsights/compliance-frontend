/* eslint-disable camelcase */

const bindHost = () => {
  if (
    process.env.IN_DOCKER &&
    typeof process.env.WEBPACK_BIND === 'undefined'
  ) {
    return '0.0.0.0';
  } else {
    return process.env.WEBPACK_BIND || 'localhost';
  }
};

const hotReload = function () {
  return process.env.HOT_RELOAD && process.env.HOT_RELOAD === 'true'
    ? true
    : false;
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
  host: bindHost(),
  allowedHosts: [
    'ci.foo.redhat.com',
    'qa.foo.redhat.com',
    'stage.foo.redhat.com',
    'prod.foo.redhat.com',
    process.env.DEFAULT_HOST,
  ],
};

module.exports.devserverConfig = devserverConfig;
