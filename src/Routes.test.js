import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import Routes from './Routes';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
jest.mock('@redhat-cloud-services/frontend-components-utilities/RBACHook');

usePermissionsWithContext.mockImplementation(() => ({
  hasAccess: true,
  isLoading: false,
}));

describe('Routes', () => {
  it('should render', async () => {
    render(
      <TestWrapper routes={['/reports']}>
        <Routes />
      </TestWrapper>
    );
    expect(await screen.findByText('Reports')).toBeInTheDocument();
  });
});
