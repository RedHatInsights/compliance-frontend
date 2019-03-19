/*global module, process*/

// Hack so that Mac OSX docker can sub in host.docker.internal instead of localhost
// see https://docs.docker.com/docker-for-mac/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host
const localhost = (process.env.PLATFORM === 'linux') ? 'localhost' : 'host.docker.internal';
const host = 'https://insights-inventory-platform-ci.5a9f.insights-dev.openshiftapps.com';

module.exports = {
    routes: {
        '/apps/compliance': { host: `http://${localhost}:8002` },
        '/rhcs/compliance': { host: `http://${localhost}:8002` },
        '/r/insights/platform': { host: 'http://access.ci.cloud.paas.upshift.redhat.com' },
        '/apps/chrome': { host: 'https://ci.cloud.paas.upshift.redhat.com' },
        '/api/compliance': { host: `http://${localhost}:3000` },
        '/r/insights/platform/inventory/': { host } // for CI env
    }
};
