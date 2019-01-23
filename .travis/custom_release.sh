#!/bin/bash
set -e
set -x

if [ "${TRAVIS_BRANCH}" = "master" ]; then
    for env in ci qa prod
    do
       echo
       echo
       echo "PUSHING ${env}-beta"
       rm -rf dist/.git
       .travis/release.sh "${env}-beta"
    done
fi
if [ "${TRAVIS_BRANCH}" = "stable" ]; then
    for env in ci qa prod
    do
	echo
	echo
	echo "PUSHING ${env}-stable"
	rm -rf dist/.git
	.travis/release.sh "${env}-stable"
    done
fi
