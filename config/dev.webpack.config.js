/* global module */

const _ = require('lodash');
const webpackConfig = require('./base.webpack.config');
const config = require('./webpack.common.js');

webpackConfig.devServer = {
    contentBase: config.paths.public,
    historyApiFallback: true,
    serveIndex: false,
    hot: process.env.HOT === 'false' ? false : true,
    allowedHosts: [
        'frontend',
        'ci.foo.redhat.com',
        'qa.foo.redhat.com',
        'stage.foo.redhat.com',
        'prod.foo.redhat.com'
    ],
    port: process.env.PORT ? process.env.PORT  : '8002',
    host: process.env.HOST ? process.env.HOST  : 'localhost'
};

module.exports = _.merge({
    performance: {
        hints: 'warning'
    }
},
webpackConfig,
require('./dev.webpack.plugins.js')
);
