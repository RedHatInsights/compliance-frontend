import { AxiosHeaders } from 'axios';
import { getAppConfig } from '@/config/appConfig';
import { getForemanCsrfToken, withForemanCsrf } from './foremanCsrf';

jest.mock('@/config/appConfig', () => ({ getAppConfig: jest.fn() }));

describe('Foreman iframe CSRF requests', () => {
  const proxyPath = '/insights_cloud/api/compliance/v2';
  const token = 'test-session-token';

  beforeEach(() => {
    getAppConfig.mockReturnValue({
      envTarget: 'iop',
      api: { complianceBasePath: proxyPath },
    });
    document.head.innerHTML = `<meta name="csrf-token" content="${token}">`;
  });

  afterEach(() => {
    document.head.innerHTML = '';
  });

  it.each(['post', 'put', 'patch', 'delete'])(
    'adds the session token to a same-origin Foreman %s request',
    (method) => {
      const result = withForemanCsrf({
        method,
        url: `${proxyPath}/policies`,
        headers: { 'Content-Type': 'application/vnd.api+json' },
      });
      expect(result.headers.get('X-CSRF-Token')).toBe(token);
      expect(result.headers.get('Content-Type')).toBe(
        'application/vnd.api+json',
      );
    },
  );

  it('does not change hosted requests', () => {
    getAppConfig.mockReturnValue({
      envTarget: 'hcc',
      api: { complianceBasePath: '/api/compliance/v2' },
    });
    const config = {
      method: 'post',
      url: '/api/compliance/v2/policies',
    };
    expect(withForemanCsrf(config)).toBe(config);
  });

  it('does not add a token to read requests', () => {
    const config = { method: 'get', url: `${proxyPath}/policies` };
    expect(withForemanCsrf(config)).toBe(config);
  });

  it('does not send the token to an unrelated path', () => {
    const config = { method: 'post', url: '/unrelated/policies' };
    expect(withForemanCsrf(config)).toBe(config);
  });

  it('reads the same-origin parent token', () => {
    const parentDocument = document.implementation.createHTMLDocument();
    parentDocument.head.innerHTML =
      '<meta name="csrf-token" content="parent-token">';
    const parent = {
      location: { origin: window.location.origin },
      document: parentDocument,
    };
    expect(getForemanCsrfToken({ parent, location: window.location })).toBe(
      'parent-token',
    );
  });

  it('rejects a cross-origin parent', () => {
    const parent = { location: { origin: 'https://outside.example.test' } };
    expect(
      getForemanCsrfToken({ parent, location: window.location }),
    ).toBeUndefined();
  });

  it('keeps an explicitly supplied token', () => {
    const result = withForemanCsrf({
      method: 'post',
      url: `${proxyPath}/policies`,
      headers: new AxiosHeaders({ 'x-csrf-token': 'explicit-token' }),
    });
    expect(result.headers.get('X-CSRF-Token')).toBe('explicit-token');
  });
});
