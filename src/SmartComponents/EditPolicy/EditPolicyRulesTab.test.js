import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import { useQuery } from '@apollo/client';
import { policies } from '@/__fixtures__/policies.js';
import EditPolicyRulesTab, { toTabsData } from './EditPolicyRulesTab.js';

jest.mock('@apollo/client');
const policy = policies.edges[0].node;

describe('EditPolicyRulesTab', () => {
  useQuery.mockImplementation(() => ({
    data: {
      benchmarks: {
        edges: [
          {
            id: '1',
            osMajorVersion: '7',
            rules: policy.rules,
          },
        ],
      },
    },
    error: undefined,
    loading: undefined,
  }));

  it('expect to render note when no rules can be configured', () => {
    render(
      <TestWrapper>
        <EditPolicyRulesTab
          setNewRuleTabs={() => {}}
          policy={{ policy: { profiles: [] } }}
          selectedRuleRefIds={[]}
          setSelectedRuleRefIds={() => {}}
          osMinorVersionCounts={{}}
        />
      </TestWrapper>
    );

    expect(screen.getByText('No rules can be configured')).toBeInTheDocument();
  });

  it('expect to render with policy passed', () => {
    render(
      <TestWrapper>
        <EditPolicyRulesTab
          setNewRuleTabs={() => {}}
          policy={policies.edges[0].node}
          selectedRuleRefIds={[]}
          setSelectedRuleRefIds={() => {}}
          osMinorVersionCounts={{
            9: {
              osMinorVersion: 9,
              count: 1,
            },
          }}
        />
      </TestWrapper>
    );

    expect(
      screen.getByRole('tab', { name: 'Rules for RHEL 7.9' })
    ).toBeInTheDocument();
  });
});

describe('.toTabsData', () => {
  it('expect to render without error', async () => {
    const policy = policies.edges[0].node;
    const osMinorVersionCounts = {
      9: {
        osMinorVersion: 9,
        count: 1,
      },
    };
    const benchmark = {
      latestSupportedOsMinorVersions: [9],
      profiles: [{ refId: policy.refId }],
    };
    const result = toTabsData(policy, osMinorVersionCounts, [benchmark], []);
    expect(result).toMatchSnapshot();
  });
});
