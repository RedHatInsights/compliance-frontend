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
  static: {
    serveIndex: false,
  },
  liveReload: hotReload(),
  hot: hotReload(),
  host: bindHost(),
  allowedHosts: [
    'stage.foo.redhat.com',
    'prod.foo.redhat.com',
    process.env.DEFAULT_HOST,
    /**
     * webpack dev server does now allow undefined entries
     */
  ].filter((item) => typeof item === 'string'),
};

module.exports.devserverConfig = devserverConfig;
