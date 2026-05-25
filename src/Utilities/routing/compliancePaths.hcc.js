import { stripLeadingSlash } from './compliancePathMapping';

const HCC_COMPLIANCE_PREFIX = 'insights/compliance/';

export function normalizePathForRouteMatch(pathname = '') {
  let p = stripLeadingSlash((pathname || '').split('?')[0]);

  if (p.startsWith(HCC_COMPLIANCE_PREFIX)) {
    p = p.slice(HCC_COMPLIANCE_PREFIX.length);
  }

  return p;
}
