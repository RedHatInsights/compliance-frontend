import {
  COMPLIANCE_POLICIES_CREATE_PATH,
  mapCompliancePathForIop,
} from './compliancePathMapping';
import {
  compliancePoliciesCreatePath as compliancePoliciesCreatePathHcc,
  resolveComplianceRouterTo as resolveComplianceRouterToHcc,
} from './compliancePaths.hcc';
import {
  compliancePoliciesCreatePath as compliancePoliciesCreatePathIop,
  resolveComplianceRouterTo as resolveComplianceRouterToIop,
} from './compliancePaths.iop';

describe('mapCompliancePathForIop', () => {
  it('maps reports', () => {
    expect(mapCompliancePathForIop('/reports')).toBe(
      '/insights_compliance/reports',
    );
    expect(mapCompliancePathForIop('/reports/abc')).toBe(
      '/insights_compliance/reports/abc',
    );
  });

  it('maps scappolicies', () => {
    expect(mapCompliancePathForIop('/scappolicies/new')).toBe(
      '/insights_compliance/scappolicies/new',
    );
  });

  it('leaves paths already under insights_compliance unchanged', () => {
    expect(mapCompliancePathForIop('/insights_compliance/reports')).toBe(
      '/insights_compliance/reports',
    );
  });

  it('leaves other segments unchanged', () => {
    expect(mapCompliancePathForIop('/other')).toBe('/other');
  });
});

describe('resolveComplianceRouterTo (HCC build)', () => {
  it('returns input unchanged', () => {
    expect(resolveComplianceRouterToHcc('/reports')).toBe('/reports');
  });
});

describe('resolveComplianceRouterTo (IoP build)', () => {
  it('maps string paths', () => {
    expect(resolveComplianceRouterToIop('/reports/1')).toBe(
      '/insights_compliance/reports/1',
    );
  });
});

describe('compliancePoliciesCreatePath (HCC build)', () => {
  it('returns legacy path', () => {
    expect(compliancePoliciesCreatePathHcc()).toBe(COMPLIANCE_POLICIES_CREATE_PATH);
  });
});

describe('compliancePoliciesCreatePath (IoP build)', () => {
  it('returns IoP segment path', () => {
    expect(compliancePoliciesCreatePathIop()).toBe(
      '/insights_compliance/scappolicies/new',
    );
  });
});
