[![Build Status](https://travis-ci.org/RedHatInsights/compliance-frontend.svg?branch=master)](https://travis-ci.org/RedHatInsights/compliance-frontend)

# compliance-frontend

React.js app for Red Hat Insights Compliance.

## Getting Started

This application requires the use of [Insights Proxy](https://github.com/RedHatInsights/insights-proxy), which is configured with default routes that proxy a staging environment for services that are not available locally.
The frontend itself will run via the `webpack-dev-server`. Both can be run either manually and separately or in a container setup.

Both will require to have hostnames like `ci.foo.redhat.com` resolve to the local host.
[Insights Proxy](https://github.com/RedHatInsights/insights-proxy/blob/master/scripts/patch-etc-hosts.sh) provides a script to patch the `/etc/hosts` file for this purpose.

## Running in containers

To run the container setup either Podman or Docker and their compose commands can be used to

```shell
  $ touch .env  # Can be used to enable a local backend and other services (see .env.example)
  $ podman-compose up
```

This will build the image if it is not yet available locally and run the containers to make the frontend available at [https://ci.foo.redhat.com:1337/insights/compliance/](https://ci.foo.redhat.com:1337/insights/compliance/)

### Opening a shell

To run tests or lint your code you might want to run a shell container, this can be done via:

```shell
  $ podman-compose up # Only required if no frontend container is running yet
  $ podman-compose run frontend bash # # Opens bash within the container
```

### Running other dependent services locally

To configure the proxy to use local services the `.env` contains a few `LOCAL_` variables that can be uncommented and adjusted.

## Running on localhost

To run a [insights-proxy](https://github.com/RedHatInsights/insights-proxy) follow the preparation steps, to then be able and run the following **within** this repositories directory.

```shell
  $ SPANDX_CONFIG="./config/spandx.config.js" bash $PROXY_PATH/scripts/run.sh
```

This will start a proxy with proper configuration for this frontend.

The frontend itself can be started with `npm run start` once all dependencies are install.

```shell
  $ npm install   # installs all packages
  $ npm run start # starts webpack bundler and serves the files with webpack dev server
```

## Code standards

Travis also lints the code, this can also be done locally with `npm run lint`.
The rules to follow are found in `eslintrc.yml`.

## Testing

Tests are run using [jest](https://jestjs.io/) and are located in a components `_COMPONENT_NAME_.test.js` file.
They run on Travis and can locally be executed via `npm run test`.

## Code Notes

* This project uses [Patternfly](https://github.com/patternfly/patternfly-react) components and should be preferred.
* The [insights-frontend-components](https://www.npmjs.com/package/@red-hat-insights/insights-frontend-components) package is included to provide components shared across the Insights Platform.
* Header and sidebar are provided by  [insights-proxy](https://github.com/RedHatInsights/insights-chrome)
* "Inventory Components" (like the SystemsTable) are loaded **via** the chrome.

## Deploying

- Pushing to 'master' will deploy the app in qa-beta, ci-beta, and prod-beta.
- Pushing to 'stable' will deploy the app in qa-stable, ci-stable, and prod-stable.
