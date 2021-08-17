# compliance-frontend

[![Build Status](https://travis-ci.org/RedHatInsights/compliance-frontend.svg?branch=master)](https://travis-ci.org/RedHatInsights/compliance-frontend)
[![Maintainability](https://api.codeclimate.com/v1/badges/dae99b3728337e64871c/maintainability)](https://codeclimate.com/github/RedHatInsights/compliance-frontend/maintainability)

UI application for Red Hat Insights Compliance.

## Running the frontend

This application requires the use of [Insights Proxy](https://github.com/RedHatInsights/insights-proxy), which is configured with default routes that proxy a staging environment for services that are not available locally.
The frontend itself will run via the `webpack-dev-server`.

Both can be run either manually and separately or in a container setup.

Both will require to have hostnames like `ci.foo.redhat.com` resolve to the local host.
[Insights Proxy](https://github.com/RedHatInsights/insights-proxy/blob/master/scripts/patch-etc-hosts.sh) provides a script to patch the `/etc/hosts` file for this purpose.

## Using useProxy

Running webpack with "useProxy" can be used instead of insights-proxy for backend routes.

```shell
$ npm run start:proxy
$ npm run start:proxy:beta # Will run the UI with beta chrome
```

### In containers (recommended)

To run the container setup either Podman or Docker and their compose commands can be used to

```shell
  $ cp .env.example .env # Can be used to enable a local backend and other services
  $ podman-compose up # Starts up the compliance frontend with a webpack proxy
```

This will build the image if it is not yet available locally and run the containers to make the frontend available at [https://ci.foo.redhat.com:1337/insights/compliance/](https://ci.foo.redhat.com:1337/insights/compliance/)

#### Opening a shell

To run tests or lint your code you might want to run a shell container, this can be done via:

```shell
  $ podman-compose up                # Only required if no frontend container is running yet
  $ podman-compose run frontend bash # Opens bash within the container to run tests and other tasks
```

#### Running other dependent services locally

To configure the proxy to use local services the `.env` contains a few `LOCAL_` variables that can be uncommented and adjusted.

### Running on localhost

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

## Code Notes

### Technology stack

  * [React](https://reactjs.org)
  * [Patternfly](https://github.com/patternfly/patternfly-react)
  * [Jest](https://jestjs.io) & [enzyme](https://enzymejs.github.io/enzyme/)
  * GraphQL (using [Apollo](https://www.apollographql.com/docs/react/))

### Code standards

ESlint is configured with standards to follow and can be checked via:

```shell
$ npm run lint
```

The CI pipeline is also setup to validate pull requests.

### Components

* Patternfly (based) components should always be preferred
* Prefer functional components and [hooks](https://reactjs.org/docs/hooks-intro.html) over class components
* The [insights-frontend-components](https://www.npmjs.com/package/@red-hat-insights/insights-frontend-components) package is included to provide components shared across the Insights Platform.
* [Insights Chrome](https://github.com/RedHatInsights/insights-chrome) which provides header and sidebar, as well as authentication and related functions, which is injected/included via
[insights-proxy](https://github.com/RedHatInsights/insights-chrome)

#### Inventory Components

Some components are "hot loaded" via [Insights Chrome](https://github.com/RedHatInsights/insights-chrome). These are known as "Inventory Components" and are used for systems tables and systems details. The source for these components can be found in [insights-frontend-components](https://github.com/RedHatInsights/frontend-components/tree/master/packages/inventory#readme). With the frontend-components repository resides the [inventory-compliance](https://github.com/RedHatInsights/frontend-components/tree/master/packages/inventory-compliance) package, which implements wrapper components for these inventory components to add compliance specific behaviour.

### File organisation

 * **Presentational Components:**
   These are components that have no side effects. They may handle state internally, but do not require a store or external data source.

 * **Smart Components:**
   If a component works with any store or makes requests to an API, they are Smart Components

 * **store:**
  Contains primarily a reducer and actions for working with the [inventory](https://github.com/RedHatInsights/frontend-components/blob/master/packages/inventory/doc/inventory.md) component.

 * **Utilities:**
  Any part that isn't a component or store, should be put here.

### Testing

Tests use [jest](https://jestjs.io/) and [enzyme](https://github.com/enzymejs/enzyme).
Each component should have at least on test to verify it still renders correctly with changes.
The tests for an component should be in a file  referencing the component filename and have `.test` appended (`_COMPONENT_NAME_.test.js`).


They run on every PR and can locally be executed with:

```shell
$ npm run test
```

#### Snapshot testing

Most tests are "snapshot" tests, which verify that current test output matches a snapshot taken before. If these changes are legitimate the snapshots need to be updated with:

```shell
$ npm run test -- -u
 ```

### Updating dependencies

This repository has [dependabot](https://dependabot.com/) configured in order to update (some) packages automatically via a pull request.
Occasionally these updates will fail snapshot tests and require to update the snapshots as mentioned in the "Testing" section.

#### Running Sonarqube

Follow instructions to set up self-signed certs, as described [here](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/).

Use the docker image:

```
podman run -itv $PWD:/usr/src -v $PWD/cacerts:/opt/java/openjdk/lib/security/cacerts --rm --name sonar-scanner-cli -e SONAR_HOST_URL='<sonarqube host>' -e SONAR_LOGIN=<token> sonarsource/sonar-scanner-cli
```
