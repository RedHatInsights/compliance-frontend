import { routes } from '@/Routes';

import { getForemanSyncRoute, isIframeModalRoute } from './iopForemanSyncRoute';

const samplePathForRoute = (path) =>
  `/${path
    .replace(/:policy_id/g, 'policy-1')
    .replace(/:report_id/g, 'report-1')
    .replace(/:security_guide_id\??/g, 'guide-1')
    .replace(/:inventoryId/g, 'host-1')}`;

const modalRoutes = routes.filter((route) => route.modal);
const pageRoutes = routes.filter((route) => !route.modal);

describe('iopForemanSyncRoute', () => {
  it('returns page routes for Foreman sync', () => {
    expect(getForemanSyncRoute('/reports')).toBe('reports');
    expect(getForemanSyncRoute('/scappolicies')).toBe('scappolicies');
    expect(getForemanSyncRoute('/reports/report-1')).toBe('reports/report-1');
    expect(getForemanSyncRoute('/scappolicies/policy-1')).toBe(
      'scappolicies/policy-1',
    );
  });

  it.each(modalRoutes.map((route) => [route.path]))(
    'does not sync modal route %s to Foreman',
    (path) => {
      const samplePath = samplePathForRoute(path);

      expect(isIframeModalRoute(samplePath)).toBe(true);
      expect(getForemanSyncRoute(samplePath)).toBeNull();
    },
  );

  it.each(pageRoutes.map((route) => [route.path]))(
    'syncs non-modal route %s to Foreman',
    (path) => {
      const samplePath = samplePathForRoute(path);
      const expected = samplePath.replace(/^\/+/, '');

      expect(isIframeModalRoute(samplePath)).toBe(false);
      expect(getForemanSyncRoute(samplePath)).toBe(expected);
    },
  );
});
