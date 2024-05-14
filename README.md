# compliance-frontend

[![Build Status](https://travis-ci.org/RedHatInsights/compliance-frontend.svg?branch=master)](https://travis-ci.org/RedHatInsights/compliance-frontend)
[![Maintainability](https://api.codeclimate.com/v1/badges/dae99b3728337e64871c/maintainability)](https://codeclimate.com/github/RedHatInsights/compliance-frontend/maintainability)

UI application for Red Hat Insights Compliance.

## Running the frontend

This application requires the use of [useProxy](https://github.com/RedHatInsights/frontend-components/tree/master/packages/config#useproxy),
which serves the frontend and is configured with default routes that proxy a staging environment for services that are not available locally.

It can be run either locally or in a container setup.

Both will require to have hostnames like `stage.foo.redhat.com` resolve to the local host.
[Insights Proxy](https://github.com/RedHatInsights/insights-proxy/blob/master/scripts/patch-etc-hosts.sh) provides a script to patch the `/etc/hosts` file for this purpose.

## Using useProxy

Running webpack with "useProxy" can be used instead of insights-proxy for backend routes.

```shell
$ npm run start  # Will run only webpack
$ npm run start:proxy # Will run webpack and have proxying enabled
$ LOCAL_APIS=compliance:3000,inventory:8081,ingress:8080,rbac:9002 npm run start:proxy # Will run webpack and have proxying enabled and route APIs to local endpoints
```

### In containers

To run the container setup either Podman or Docker and their compose commands can be used to

```shell
  $ cp .env.defaults .env # Can be used to enable a local backend and other services
  $ podman-compose up # Starts up the compliance frontend with a webpack proxy
```

This will build the image if it is not yet available locally and run the containers to make the frontend available at [https://stage.foo.redhat.com:1337/insights/compliance/](https://stage.foo.redhat.com:1337/insights/compliance/)

#### Opening a shell

To run tests or lint your code you might want to run a shell container, this can be done via:

```shell
  $ podman-compose up                # Only required if no frontend container is running yet
  $ podman-compose run frontend bash # Opens bash within the container to run tests and other tasks
```

#### Running other dependent services locally

To run the frontend with proxy and local services/APIs the `LOCAL_APIS` environment variable can be used.
To enable the routes for proxying to a local inventory add `inventory:5000` (`APP_ID:APP_API_PORT`) to the `LOCAL_APIS` variable in a `.env` or start the proxy with it.

All application/service hosts for the APIs can be overridden via a environment variable like `LOCAL_INVENTORY_HOST`.

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
$ npm run lint:js:fix # Fixes linting issues
```

The CI pipeline is also setup to validate pull requests.

### Components

* Patternfly (based) components should always be preferred
* Prefer functional components and [hooks](https://reactjs.org/docs/hooks-intro.html) over class components
* The [insights-frontend-components](https://www.npmjs.com/package/@red-hat-insights/insights-frontend-components) package is included to provide components shared across the Insights Platform.
* [Insights Chrome](https://github.com/RedHatInsights/insights-chrome) which provides header and sidebar, as well as authentication and related functions, which is injected/included via webpack-dev-servers `useProxy`.

#### Federated modules

Certain platform applications expose components that can be used by other applications without requiring to add it as a dependency.
Compliance currently exposes the `SystemsDetails` as a federated module, which is used in the inventory application.
Compliance also imports the `InventoryTable` and `InventoryDetails` components, which are federated modules exposed by the Inventory application.

##### Running compliance with locally built federated modules

###### Imported from the [insights-inventory-frontend](https://github.com/RedHatInsights/insights-inventory-frontend)

In order to develop and test changes for the `InventoryTable` and `InventoryDetails` within compliance:

1. Pull the `insights-inventory-frontend` repository and change into the directory
2. Run `npm install` to install all packages
3. Run the `npm run start -- --port=8003` task

This will run a webpack instance that builds and serves the inventory frontend including federated modules from the local source code.

To use them in/with Compliance and set routes for the locally running Inventory app, configure it with the `LOCAL_APPS` environment variable in `.env` or start the proxy with:

```sh
$ LOCAL_APPS=inventory:8003 npm run start:proxy
```

See also https://github.com/RedHatInsights/frontend-components/blob/master/packages/config/README.md#running-multiple-local-frontend-applications

###### Run compliance building and exposing federated modules

Developing and testing changes in components that Compliance exposes is also possible in a similar way.
Compliance also provides a `npm run start:federated` task, that also builds and serves the `SystemsDetails` as a federated module.

To make use of it in another application it will require setting up the necessary routes in that applications configuration,
but instead of rerouting to inventory, the routes will need match `/compliance/` routes.
See the FEC script documentation for an example: https://github.com/RedHatInsights/frontend-components/tree/master/packages/config#fec-node-scripts

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

Tests use [jest](https://jestjs.io/) and [enzyme](https://github.com/enzymejs/enzyme) and the (React) (Testing Library)[https://testing-library.com].
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

#### Bumping Patternfly and RedHatServices packages

Two common sets of packages that should be updated regularly are packages from RedHatServices and Patternfly.
For these there are two npm tasks to update them in bulk:

```
$ npm run bump:redhatservices
$ npm run bump:patternfly
```

#### Running Sonarqube

Follow instructions to set up self-signed certs, as described [here](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/).

Use the docker image:

```
podman run -itv $PWD:/usr/src -v $PWD/cacerts:/opt/java/openjdk/lib/security/cacerts --rm --name sonar-scanner-cli -e SONAR_HOST_URL='<sonarqube host>' -e SONAR_LOGIN=<token> sonarsource/sonar-scanner-cli
```
