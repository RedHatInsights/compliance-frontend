import { getForemanHostComplianceHref } from './getForemanHostComplianceHref';

describe('getForemanHostComplianceHref', () => {
  it('builds the Foreman host details Compliance tab URL', () => {
    expect(getForemanHostComplianceHref('demo.example.com')).toBe(
      '/new/hosts/demo.example.com#/Compliance',
    );
  });
});
