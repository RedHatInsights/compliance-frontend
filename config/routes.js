const { localRoutesFor } = require('./helpers');

const localAppApi =
  process.env.LOCAL_API === 'true'
    ? `${process.env.LOCAL_API_HOST || process.env.DEFAULT_HOST}:${
        process.env.LOCAL_API_PORT
      },`
    : '';
const localApis = localAppApi + (process.env.LOCAL_APIS || '');

module.exports = {
  routes: {
    ...(localApis && localApis !== '' ? localRoutesFor('/api', localApis) : {}),
  },
};
