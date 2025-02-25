import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import ComplianceSystems from './ComplianceSystems.js';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import { buildPoliciesV2 } from '../../__factories__/policies';

jest.mock('@/Utilities/hooks/useAPIV2FeatureFlag', () => jest.fn(() => true));
jest.mock('Utilities/hooks/api/usePolicies', () => jest.fn());
const policiesData = buildPoliciesV2(2);

describe('ComplianceSystems', () => {
  it('expect to render inventory table when policies are loaded', () => {
    usePolicies.mockImplementation(() => ({
      data: { data: policiesData, meta: { total: policiesData.length } },
      loading: false,
      error: null,
    }));

    render(
      <TestWrapper>
        <ComplianceSystems />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Inventory Table')).toBeInTheDocument();
  });
});
