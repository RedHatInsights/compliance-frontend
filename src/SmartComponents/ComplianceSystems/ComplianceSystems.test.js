import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import ComplianceSystems from './ComplianceSystems.js';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import { buildPolicies } from '../../__factories__/policies';

jest.mock('Utilities/hooks/api/usePolicies', () => jest.fn());
const policiesData = buildPolicies(2);
jest.mock('Utilities/hooks/useFeatureFlag', () => () => true);

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
      </TestWrapper>,
    );

    expect(screen.getByLabelText('Inventory Table')).toBeInTheDocument();
  });
});
