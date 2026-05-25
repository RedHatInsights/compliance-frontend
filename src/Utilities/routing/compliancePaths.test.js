import { COMPLIANCE_POLICIES_CREATE_PATH } from '@/constants';
import { mapCompliancePathForIop } from './compliancePathMapping';
import { resolveComplianceRouterTo } from './compliancePaths.iop';

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
    expect(mapCompliancePathForIop(COMPLIANCE_POLICIES_CREATE_PATH)).toBe(
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

describe('resolveComplianceRouterTo (IoP build)', () => {
  it('maps string paths', () => {
    expect(resolveComplianceRouterTo('/reports/1')).toBe(
      '/insights_compliance/reports/1',
    );
  });
});
