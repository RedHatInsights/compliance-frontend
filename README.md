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
SPANDX_CONFIG="./config/spandx.config.js" bash $PROXY_PATH/scripts/run.sh
```


## Build app

1. ```npm install```

2. ```npm run start```
    - starts webpack bundler and serves the files with webpack dev server

### Testing

- Travis is used to test the build for this code.
  - `npm run test` will run linters and tests

## Deploying

- Pushing to 'master' will deploy the app in qa-beta, ci-beta, and prod-beta.
- Pushing to 'stable' will deploy the app in qa-stable, ci-stable, and prod-stable.

# Patternfly

- This project imports Patternfly components:
  - [Patternfly React](https://github.com/patternfly/patternfly-react)

## Insights Components

Insights Platform will deliver components and static assets through [npm](https://www.npmjs.com/package/@red-hat-insights/insights-frontend-components). ESI tags are used to import the [chroming](https://github.com/RedHatInsights/insights-chrome) which takes care of the header, sidebar, and footer.
