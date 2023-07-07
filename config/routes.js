const { localRoutesFor } = require('./helpers');

const localAppApi =
  process.env.LOCAL_API === 'true'
    ? `${process.env.LOCAL_API_HOST || process.env.DEFAULT_HOST}:${
        process.env.LOCAL_API_PORT
      },`
    : '';
const localApis = localAppApi + (process.env.LOCAL_APIS || '');

const localAppRoutes = process.env.LOCAL_APPS
  ? localRoutesFor(
      `${process.env.BETA === 'true' ? '/beta' : ''}/apps`,
      process.env.LOCAL_APPS
    )
  : {};

module.exports = {
  routes: {
    ...localAppRoutes,
    ...(localApis && localApis !== '' ? localRoutesFor('/api', localApis) : {}),
  },
};
