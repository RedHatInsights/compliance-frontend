#!/bin/sh -ex
# Merges coverage reports from cypress and jest tests
# and generates an HTML report to view and json report to submit to codecov

mkdir -p coverage/src

cp ./coverage-cypress/coverage-final.json ./coverage/src/cypress.json
cp ./coverage-jest/coverage-final.json ./coverage/src/jest.json

npx nyc merge ./coverage/src ./coverage/final.json
npx nyc report -t ./coverage --reporter json --report-dir ./coverage/json
npx nyc report -t ./coverage --reporter html --report-dir ./coverage/html

case `uname` in
  Darwin)
    export CODECOV_BIN="https://uploader.codecov.io/latest/macos/codecov"
  ;;
  Linux)
    export CODECOV_BIN="https://uploader.codecov.io/latest/linux/codecov"
  ;;
esac

# Workaround for https://github.com/codecov/uploader/issues/475
unset NODE_OPTIONS
echo "Downloading codecov binary from $CODECOV_BIN"

curl -Os $CODECOV_BIN
chmod +x codecov

echo "Uploading to codecov"

./codecov -t ${CODECOV_TOKEN} -f "./coverage/json/coverage-final.json"
