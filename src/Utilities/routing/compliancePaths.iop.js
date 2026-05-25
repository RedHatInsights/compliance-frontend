import {
  mapCompliancePathForIop,
  resolveRouterToWithMapper,
  stripLeadingSlash,
} from './compliancePathMapping';

const IOP_FOREMAN_PREFIX = 'foreman_rh_cloud/';

export function resolveComplianceRouterTo(to) {
  return resolveRouterToWithMapper(to, mapCompliancePathForIop);
}

export function normalizePathForRouteMatch(pathname = '') {
  let p = stripLeadingSlash((pathname || '').split('?')[0]);

  if (p.startsWith(IOP_FOREMAN_PREFIX)) {
    p = p.slice(IOP_FOREMAN_PREFIX.length);
  }

  return stripLeadingSlash(mapCompliancePathForIop(`/${p}`));
}
