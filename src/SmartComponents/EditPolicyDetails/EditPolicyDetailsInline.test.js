import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditPolicyDetailsInline from './EditPolicyDetailsInline';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import useUpdatePolicy from 'Utilities/hooks/api/useUpdatePolicy';
import { TextArea } from '@patternfly/react-core';
import TestWrapper from 'Utilities/TestWrapper';

jest.mock('@redhat-cloud-services/frontend-components-utilities/RBACHook');
jest.mock('Utilities/hooks/api/useUpdatePolicy');

describe('EditPolicyDetailsInline', () => {
  beforeEach(() => {
    useUpdatePolicy.mockReturnValue({
      fetch: jest.fn(() => Promise.resolve()),
    });
    usePermissionsWithContext.mockImplementation(() => ({
      hasAccess: true,
      isLoading: false,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockPolicy = { id: '123', name: 'Test Policy' };
  const mockRefetch = jest.fn();

  const defaultProps = {
    text: 'Test Text',
    policy: mockPolicy,
    variant: 'threshold',
    propertyName: 'complianceThreshold',
    inlineClosedText: 'Test Text Closed',
    label: 'Test Label',
    refetch: mockRefetch,
    id: 'policydetails-input-threshold',
  };

  it('Renders the component with default props', () => {
    render(<EditPolicyDetailsInline {...defaultProps} />, {
      wrapper: TestWrapper,
    });
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Text Closed')).toBeInTheDocument();
  });

  it('No pencil button when user does not have access', () => {
    usePermissionsWithContext.mockImplementation(() => ({
      hasAccess: false,
      isLoading: false,
    }));

    render(<EditPolicyDetailsInline {...defaultProps} />, {
      wrapper: TestWrapper,
    });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('Open and save edits works', async () => {
    render(<EditPolicyDetailsInline {...defaultProps} />, {
      wrapper: TestWrapper,
    });

    const pencilButton = screen.getByRole('button');
    fireEvent.click(pencilButton);
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '77' } });

    const saveButton = screen.getByRole('button', { name: /Save edits/i });
    fireEvent.click(saveButton);

    await waitFor(() => expect(mockRefetch).toHaveBeenCalled());
  });

  it('Cancels edits when the cancel button is clicked', async () => {
    render(<EditPolicyDetailsInline {...defaultProps} />, {
      wrapper: TestWrapper,
    });

    const pencilButton = screen.getByRole('button');
    fireEvent.click(pencilButton);

    expect(screen.getByRole('textbox')).toBeInTheDocument();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '77' } });

    const cancelButton = screen.getByRole('button', { name: /Cancel edits/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

    await waitFor(() => expect(mockRefetch).not.toHaveBeenCalled());
  });

  it('Save button disabled on invalid threshold input', () => {
    render(<EditPolicyDetailsInline {...defaultProps} />, {
      wrapper: TestWrapper,
    });
    const pencilButton = screen.getByRole('button');
    fireEvent.click(pencilButton);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Invalid Threshold' } });

    const saveButton = screen.getByRole('button', { name: /Save edits/i });
    expect(saveButton).toBeDisabled();
    expect(
      screen.getByText(/Threshold has to be a number between 0 and 100/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Threshold values can have a maximum of one decimal place/i,
      ),
    ).toBeInTheDocument();
  });

  it('Description input displayed correctly', () => {
    const props = {
      ...defaultProps,
      variant: 'description',
      text: 'Test description',
      id: '',
      Component: TextArea,
      label: 'Policy description',
      propertyName: 'description',
      'aria-label': 'TextArea',
    };

    render(<EditPolicyDetailsInline {...props} />, {
      wrapper: TestWrapper,
    });
    expect(screen.getByText('Test description')).toBeInTheDocument();

    const pencilButton = screen.getByRole('button');
    fireEvent.click(pencilButton);

    const textbox = screen.getByRole('textbox');
    expect(textbox.tagName).toBe('TEXTAREA');
  });
});
