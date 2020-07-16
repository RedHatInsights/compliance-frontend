/* global module */

const _ = require('lodash');
const webpackConfig = require('./base.webpack.config');
const config = require('./webpack.common.js');

if (process.env.DEFAULT_HOST) {
    default_host = process.env.DEFAULT_HOST;
} else {
    default_host = 'host.docker.internal';
}

// Hot reloading will not work at the moment within a container because of CORS issues.
const hotReload = function () {
    process.env.HOT_RELOAD && process.env.HOT_RELOAD === 'true' ? true : false
}

webpackConfig.devServer = {
    contentBase: config.paths.public,
    historyApiFallback: true,
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
    ],
    port: process.env.FRONTEND_PORT ? process.env.FRONTEND_PORT  : '8002',
    host: process.env.FRONTEND_HOST ? process.env.FRONTEND_HOST  : '0.0.0.0'
};

module.exports = _.merge({
    performance: {
        hints: 'warning'
    }
},
webpackConfig,
require('./dev.webpack.plugins.js')
);
