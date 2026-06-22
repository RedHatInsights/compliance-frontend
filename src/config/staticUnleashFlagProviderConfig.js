export const staticUnleashFlagProviderConfig = {
  url: 'http://localhost',
  clientKey: 'static',
  appName: 'compliance',
  disableRefresh: true,
  disableMetrics: true,
  bootstrap: [
    {
      name: 'compliance.kessel_enabled',
      enabled: false,
      variant: { name: 'disabled', enabled: false },
      impressionData: false,
    },
  ],
  bootstrapOverride: true,
};
