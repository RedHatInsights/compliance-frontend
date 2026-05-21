const { resolve } = require('path');
const alias = require('./config/aliases');
const packageJson = require('./package.json');
const { localRoutesFor } = require('./config/helpers');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

const bundle = 'insights';
const appName = packageJson[bundle].appname;
const isIOP = process.env.IOP === 'true';

// IoP builds must keep appName "compliance" so static output lives under
// /assets/apps/compliance/ (matches foreman_rh_cloud Scalprum manifest URL).

const iopComplianceMount = resolve(__dirname, './src/IopComplianceMount.js');

const compliancePlatform = isIOP ? 'iop' : 'hcc';

const complianceLink = resolve(
  __dirname,
  `./src/PresentationalComponents/ComplianceLinks/complianceLink.${compliancePlatform}.js`,
);

const compliancePaths = resolve(
  __dirname,
  `./src/routing/compliancePaths.${compliancePlatform}.js`,
);

const useComplianceNavigate = resolve(
  __dirname,
  `./src/Utilities/hooks/useComplianceNavigate/useComplianceNavigate.${compliancePlatform}.js`,
);

const complianceRoutePrefixes = resolve(
  __dirname,
  `./src/routing/complianceRoutePrefixes.${compliancePlatform}.js`,
);

const useComplianceChrome = resolve(
  __dirname,
  `./src/platform/chrome/useComplianceChrome.${compliancePlatform}.js`,
);

// IoP host registers React 16 in the default share scope. `singleton: true` lets that win.
// Use `singleton: false` + local `import` so the remote keeps React 18 (TanStack Query v5, etc.).
const iopReactShared = isIOP
  ? {
      react: {
        singleton: false,
        eager: true,
        strictVersion: true,
        version: packageJson.dependencies.react,
        requiredVersion: packageJson.dependencies.react,
        import: resolve(__dirname, 'node_modules/react'),
      },
      'react-dom': {
        singleton: false,
        eager: true,
        strictVersion: true,
        version: packageJson.dependencies['react-dom'],
        requiredVersion: packageJson.dependencies['react-dom'],
        import: resolve(__dirname, 'node_modules/react-dom'),
      },
    }
  : null;

const iopFederatedExclude = isIOP
  ? ['react', 'react-dom', '@unleash/proxy-client-react']
  : [];

// TODO Move to fec webpack config similar to LOCAL_APPS
const routes = {
  ...(process.env.LOCAL_APIS && process.env.LOCAL_APIS !== ''
    ? localRoutesFor('/api', process.env.LOCAL_APIS)
    : {}),
};

module.exports = {
  appName,
  appUrl: `/${bundle}/${appName}`,
  useProxy: process.env.PROXY === 'true',
  ...(isIOP ? { deployment: 'assets/apps' } : {}),
  devtool: 'hidden-source-map',
  plugins: [
    ...(process.env.ENABLE_SENTRY
      ? [
          sentryWebpackPlugin({
            ...(process.env.SENTRY_AUTH_TOKEN && {
              authToken: process.env.SENTRY_AUTH_TOKEN,
            }),
            org: 'red-hat-it',
            project: 'compliance-rhel',
            moduleMetadata: ({ release }) => ({
              dsn: `https://6410c806f0ac7b638105bb4e15eb3399@o490301.ingest.us.sentry.io/4508083145408512`,
              org: 'red-hat-it',
              project: 'compliance-rhel',
              release,
            }),
          }),
        ]
      : []),
  ],
  moduleFederation: {
    // IoP host ships React 16; compliance needs its own React 18 on IoP.
    ...(iopFederatedExclude.length ? { exclude: iopFederatedExclude } : {}),
    shared: [
      ...(iopReactShared ? [iopReactShared] : []),
      {
        'react-router-dom': {
          singleton: !isIOP,
          ...(isIOP ? {} : { import: false }),
          version: packageJson.dependencies['react-router-dom'],
          requiredVersion: '>=6.0.0 <7.0.0',
        },
      },
    ],
    exposes: {
      './RootApp': resolve(
        __dirname,
        `/src/${process.env.NODE_ENV !== 'production' ? 'Dev' : ''}AppEntry`,
      ),
      './SystemDetail': resolve(__dirname, '/src/Modules/ComplianceDetails'),
      './ReportPDFBuild': resolve(
        __dirname,
        '/src/SmartComponents/ExportPDF/ReportPDFBuild',
      ),
      ...(isIOP && {
        './IopComplianceMount': iopComplianceMount,
      }),
    },
  },
  resolve: {
    alias: {
      '@/PresentationalComponents/ComplianceLinks/complianceLink$': complianceLink,
      '@/routing/compliancePaths$': compliancePaths,
      '@/routing/complianceRoutePrefixes$': complianceRoutePrefixes,
      '@/Utilities/hooks/useComplianceNavigate$': useComplianceNavigate,
      '@/platform/chrome/useComplianceChrome$': useComplianceChrome,
      ...alias,
      ...(isIOP
        ? {
            react: resolve(__dirname, 'node_modules/react'),
            'react-dom': resolve(__dirname, 'node_modules/react-dom'),
            'react/jsx-runtime': resolve(
              __dirname,
              'node_modules/react/jsx-runtime',
            ),
          }
        : {}),
    },
  },
  routes,
  _unstableSpdy: true,
  frontendCRDPath: 'deployment_template.yaml',
};
