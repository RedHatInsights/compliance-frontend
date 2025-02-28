import { render } from '@testing-library/react';
import TestWrapper from '@/Utilities/TestWrapper';
import { policies } from '@/__fixtures__/policies.js';

import EditPolicyForm from './EditPolicyForm';
import { useNewRulesAlertState } from './hooks';

jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useNewRulesAlertState: jest.fn(() => [false, () => false]),
}));

// TODO: implement EditPolicyForm tests for REST
describe.skip('EditPolicyForm', () => {
  const policy = {
    ...policies.edges[0].node,
    supportedOsVersions: ['7.8', '7.9'],
  };
  const mocks = [
    {
      request: {
        query: {}, //BENCHMARKS_QUERY,
      },
      result: {
        data: {},
      },
    },
  ];
  const defaultProps = {
    setUpdatedPolicy: () => ({}),
    setSelectedRuleRefIds: () => ({}),
    setSelectedSystems: () => ({}),
    policy,
  };

  it('expect to render without error', () => {
    useNewRulesAlertState.mockImplementation(() => [false, () => false]);
    const { asFragment } = render(
      <TestWrapper mocks={mocks}>
        <EditPolicyForm {...defaultProps} />
      </TestWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render with alter', () => {
    useNewRulesAlertState.mockImplementation(() => [true, () => true]);
    const { asFragment } = render(
      <TestWrapper mocks={mocks}>
        <EditPolicyForm {...defaultProps} />
      </TestWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
