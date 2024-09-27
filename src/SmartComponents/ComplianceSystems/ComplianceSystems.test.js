import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import ComplianceSystems from './ComplianceSystems.js';
import { useQuery } from '@apollo/client';

jest.mock('@apollo/client');
jest.mock('@/Utilities/hooks/useAPIV2FeatureFlag', () => jest.fn(() => false));

describe('ComplianceSystems', () => {
  it('expect to render inventory table when policies are loaded', () => {
    useQuery.mockImplementation(() => ({
      loading: false,
      data: {
        profiles: {
          edges: [
            {
              node: { id: 1, name: 'RHEL', osMajorVersion: '7' },
            },
          ],
        },
      },
    }));

    render(
      <TestWrapper>
        <ComplianceSystems />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Inventory Table')).toBeInTheDocument();
  });
});
