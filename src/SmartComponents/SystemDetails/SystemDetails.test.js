import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import SystemDetails from './SystemDetails.js';
import useSystem from 'Utilities/hooks/api/useSystem';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useParams: jest.fn(() => ({
    inventoryId: '1',
  })),
}));

jest.mock('Utilities/hooks/useDocumentTitle', () => ({
  useTitleEntity: () => ({}),
  setTitle: () => ({}),
}));

jest.mock('Utilities/hooks/api/useSystem', () => jest.fn());
jest.mock('Utilities/hooks/useFeatureFlag', () => () => true);
jest.mock('Utilities/hooks/usePermissionCheck', () => ({
  useKesselPermissions: jest.fn(() => ({ hasAccess: true, isLoading: false })),
}));

describe('SystemDetails', () => {
  it('expect to render Inventory Details Wrapper', () => {
    useSystem.mockImplementation(() => ({
      data: {
        data: { display_name: 'foo', policies: [{}], insights_id: '123' },
      },
      error: undefined,
      loading: undefined,
    }));
    render(
      <TestWrapper>
        <SystemDetails route={{}} />
      </TestWrapper>,
    );

    expect(
      screen.getByLabelText('Inventory Details Wrapper'),
    ).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
