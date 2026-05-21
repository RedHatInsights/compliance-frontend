const stripLeadingSlash = (s) => (s && s.startsWith('/') ? s.slice(1) : s);

const IOP_COMPLIANCE_BASE = 'insights_compliance';

const IOP_LEGACY_SEGMENT = {
  reports: `${IOP_COMPLIANCE_BASE}/reports`,
  scappolicies: `${IOP_COMPLIANCE_BASE}/scappolicies`,
};

export const COMPLIANCE_POLICIES_CREATE_PATH = '/scappolicies/new';

/**
 * @param {string} path e.g. `/reports/abc` or `scappolicies/new`
 * @returns {string} path with leading `/`
 */
export function mapCompliancePathForIop(path = '') {
  const withoutLeadingSlash = stripLeadingSlash(path.split('?')[0]);
  if (!withoutLeadingSlash) {
    return '/';
  }

  if (withoutLeadingSlash.startsWith(`${IOP_COMPLIANCE_BASE}/`)) {
    return `/${withoutLeadingSlash}`;
  }

  const [head, ...rest] = withoutLeadingSlash.split('/');
  const mapped = IOP_LEGACY_SEGMENT[head];
  if (mapped) {
    const tail = rest.length ? `/${rest.join('/')}` : '';
    return `/${mapped}${tail}`;
  }

  return `/${withoutLeadingSlash}`;
}

/**
 * @param {string | import('react-router-dom').To} to
 * @param {(path: string) => string} mapPath
 */
export function resolveRouterToWithMapper(to, mapPath) {
  if (typeof to === 'string') {
    return mapPath(to);
  }

  if (typeof to === 'object' && to !== null) {
    if (typeof to.pathname === 'string') {
      return { ...to, pathname: mapPath(to.pathname) };
    }
    if (typeof to.to === 'string') {
      const { to: path, ...rest } = to;
      return { ...rest, pathname: mapPath(path) };
    }
  }

  return to;
}
