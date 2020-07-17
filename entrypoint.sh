#!/bin/bash
set -e

if [[ ! -d "/frontend/node_modules/@redhat-cloud-services" ]]; then
    echo "No modules installed! Installing..."
    cd /frontend; /usr/bin/npm install;
fi

exec "$@"
