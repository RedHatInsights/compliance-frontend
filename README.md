[![Build Status](https://travis-ci.org/RedHatInsights/compliance-frontend.svg?branch=master)](https://travis-ci.org/RedHatInsights/compliance-frontend)

# compliance-frontend

React.js app for Red Hat Insights Compliance.

## Getting Started

There is a [comprehensive quick start guide in the Storybook Documentation](https://github.com/RedHatInsights/insights-frontend-storybook/blob/master/src/docs/welcome/quickStart/DOC.md) to setting up an Insights environment complete with:

- Insights Frontend Starter App

- [Insights Chroming](https://github.com/RedHatInsights/insights-chrome)
- [Insights Proxy](https://github.com/RedHatInsights/insights-proxy)

Note: You will need to set up the Insights environment if you want to develop with the starter app due to the consumption of the chroming service as well as setting up your global/app navigation through the API.

You should also run [Insights Compliance Backend](https://github.com/RedHatInsights/compliance-backend) so that the frontend can consume its data from somewhere.

## Running locally
Have [insights-proxy](https://github.com/RedHatInsights/insights-proxy) installed under PROXY_PATH

```shell
  $ SPANDX_CONFIG="./config/spandx.config.js" bash $PROXY_PATH/scripts/run.sh
```

## Build & run the application

There are two ways to start the frontend, either locally or in a container.
Both will make the compiled JavaScript available on [http://localhost:8002](http://localhost:8002) (or `http://DOCKER_HOST`)

### Local Environment

You can run the webpack-dev-server locally with:

```shell
  $ npm install   # installs all packages
  $ npm run start # starts webpack bundler and serves the files with webpack dev server
```

### Docker Environment

You can also start a containerized environment via:

```shell
  $ docker-compose up
```

This will build the image if it is not yet available locally and run the container.

#### Opening a shell

To run tests or lint your code you might want to run a shell container, this can be done via:

```shell
  $ docker-compose up # Only required if no frontend container is running yet
  $ docker-compose exec frontend bash # # Opens bash within the container
```

## Testing

Tests are run using `jest`[1] and are located in a components `_COMPONENT_NAME_.test.js` file.
They run on Travis and can locally be executed via `npm run test`.

[1] https://jestjs.io/

## Code standards

Travis also lints the code, this can also be done locally with `npm run lint`.
The rules to follow are found in `eslintrc.yml`.

## Deploying

- Pushing to 'master' will deploy the app in qa-beta, ci-beta, and prod-beta.
- Pushing to 'stable' will deploy the app in qa-stable, ci-stable, and prod-stable.

## Patternfly

- This project imports Patternfly components:
  - [Patternfly React](https://github.com/patternfly/patternfly-react)

## Insights Components

Insights Platform will deliver components and static assets through [npm](https://www.npmjs.com/package/@red-hat-insights/insights-frontend-components). ESI tags are used to import the [chroming](https://github.com/RedHatInsights/insights-chrome) which takes care of the header, sidebar, and footer.
