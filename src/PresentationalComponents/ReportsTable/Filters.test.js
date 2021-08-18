import {
  policyNameFilter,
  policyTypeFilter,
  operatingSystemFilter,
  policyComplianceFilter,
} from './Filters';
import { policies as rawPolicies } from '@/__fixtures__/policies.js';
const profiles = rawPolicies.edges.map((policy) => policy.node);

describe('policyNameFilter', () => {
  it('expect to return results', () => {
    const filterFunction = policyNameFilter[0].filter;
    const result = filterFunction(profiles, 'Unclassified');
    expect(result).toMatchSnapshot();
  });
});

describe('policyTypeFilter', () => {
  it('expect to return results', () => {
    const filterFunction = policyTypeFilter([])[0].filter;
    const result = filterFunction(profiles, [
      'b71376fd-015e-4209-99af-4543e82e5dc5-policy',
    ]);
    expect(result).toMatchSnapshot();
  });
});

describe('operatingSystemFilter', () => {
  it('expect to return results', () => {
    const filterFunction = operatingSystemFilter(['7'])[0].filter;
    const result = filterFunction(profiles, ['7']);
    expect(result).toMatchSnapshot();
  });
});

describe('policyComplianceFilter', () => {
  it('expect to return results', () => {
    const filterFunction = policyComplianceFilter[0].filter;
    const result = filterFunction(profiles, ['0-49']);
    expect(result).toMatchSnapshot();
  });
});
