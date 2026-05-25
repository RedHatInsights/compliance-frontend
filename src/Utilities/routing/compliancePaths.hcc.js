import {
  COMPLIANCE_POLICIES_CREATE_PATH,
  mapCompliancePathForIop,
} from './compliancePathMapping';

export { COMPLIANCE_POLICIES_CREATE_PATH, mapCompliancePathForIop };

export function compliancePoliciesCreatePath() {
  return COMPLIANCE_POLICIES_CREATE_PATH;
}

export function resolveComplianceRouterTo(to) {
  return to;
}

export function normalizePathForRouteMatch(pathname = '') {
  const stripLeadingSlash = (s) => (s && s.startsWith('/') ? s.slice(1) : s);
  let p = stripLeadingSlash((pathname || '').split('?')[0]);

  const prefix = 'insights/compliance/';
  if (p.startsWith(prefix)) {
    p = p.slice(prefix.length);
  }
  return p;
}

export function complianceDocumentHref(hccHref) {
  return hccHref;
}
