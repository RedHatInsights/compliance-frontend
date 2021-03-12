#!/bin/bash
set -e

if [[ ! -d "/compliance/node_modules/@redhat-cloud-services" ]]; then
    echo "No modules installed! Installing..."
    cd /compliance; /usr/bin/npm install;
fi

export IN_DOCKER='true';

exec "$@"
