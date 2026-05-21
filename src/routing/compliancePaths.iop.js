import {
  COMPLIANCE_POLICIES_CREATE_PATH,
  mapCompliancePathForIop,
  resolveRouterToWithMapper,
} from './compliancePathMapping';

export { COMPLIANCE_POLICIES_CREATE_PATH, mapCompliancePathForIop };

export function compliancePoliciesCreatePath() {
  return mapCompliancePathForIop(COMPLIANCE_POLICIES_CREATE_PATH);
}

export function resolveComplianceRouterTo(to) {
  return resolveRouterToWithMapper(to, mapCompliancePathForIop);
}

export function normalizePathForRouteMatch(pathname = '') {
  const stripLeadingSlash = (s) => (s && s.startsWith('/') ? s.slice(1) : s);
  let p = stripLeadingSlash((pathname || '').split('?')[0]);

  if (p.startsWith('foreman_rh_cloud/')) {
    p = p.slice('foreman_rh_cloud/'.length);
  }

  return stripLeadingSlash(mapCompliancePathForIop(`/${p}`));
}

export function complianceDocumentHref(hccHref) {
  if (typeof hccHref !== 'string') {
    return hccHref;
  }

  if (hccHref.startsWith('/insights/compliance/')) {
    const rest = hccHref.slice('/insights/compliance/'.length);
    return `/foreman_rh_cloud${mapCompliancePathForIop(rest)}`;
  }
  return hccHref;
}
