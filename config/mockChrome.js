const mockChrome = {
  updateDocumentTitle: () => ({}),
  auth: {
    getUser: () =>
      Promise.resolve({
        identity: {
          account_number: '0',
          type: 'User',
          user: {
            is_org_admin: true,
          },
        },
        entitlements: {
          hybrid_cloud: { is_entitled: true },
          insights: { is_entitled: true },
          openshift: { is_entitled: true },
          smart_management: { is_entitled: false },
        },
      }),
  },
  appAction: () => ({}),
  appObjectId: () => ({}),
  on: () => ({}),
  getUserPermissions: () => Promise.resolve(['inventory:*:*']),
  isBeta: () => false,
  getApp: () => 'compliance',
  getBundle: () => 'insights',
};

export default mockChrome;
