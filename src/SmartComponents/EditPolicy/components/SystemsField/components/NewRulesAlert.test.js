import { render, fireEvent, screen } from '@testing-library/react';
import NewRulesAlert from './NewRulesAlert';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate'
);

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

describe('NewRulesAlert', () => {
  it('navigates to rule tab on clicking the action link', () => {
    const naviateMock = jest.fn();
    useNavigate.mockImplementation(() => naviateMock);
    render(<NewRulesAlert />);
    fireEvent.click(screen.getByText('Open rule editing'));

    expect(naviateMock).toHaveBeenCalled();
  });
});
