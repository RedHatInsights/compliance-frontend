import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper';
import userEvent from '@testing-library/user-event';
import { supportedProfiles } from '../../../__fixtures__/supportedProfiles';
import useSecurityGuidesOS from 'Utilities/hooks/api/useSecurityGuidesOS';
import useSupportedProfiles from 'Utilities/hooks/api/useSupportedProfiles';
import CreateSCAPPolicyRest from './CreateSCAPPolicyRest';

jest.mock('Utilities/hooks/api/useSecurityGuidesOS');
jest.mock('Utilities/hooks/api/useSupportedProfiles');

describe('CreateSCAPPolicyRest', () => {
  const change = jest.fn();
  const availableVersions = [6, 7, 8, 9];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders progressbar on loading data', () => {
    useSecurityGuidesOS.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    });
    useSupportedProfiles.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    });
    render(
      <TestWrapper>
        <CreateSCAPPolicyRest change={change} />
      </TestWrapper>
    );

    screen.getByRole('progressbar');
  });

  it('renders available OS major versions when fetched', async () => {
    useSecurityGuidesOS.mockReturnValue({
      data: availableVersions,
      loading: false,
      error: undefined,
    });
    useSupportedProfiles.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    });
    render(
      <TestWrapper>
        <CreateSCAPPolicyRest change={change} />
      </TestWrapper>
    );

    await waitFor(() => {
      screen.getByText(
        /select the operating system and policy type for this policy\./i
      );
    });
    availableVersions.forEach((version) => screen.getByText(`RHEL ${version}`));
  });

  it('calls the change callback on OS select', async () => {
    useSecurityGuidesOS.mockReturnValue({
      data: availableVersions,
      loading: false,
      error: undefined,
    });
    useSupportedProfiles.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    });
    render(
      <TestWrapper>
        <CreateSCAPPolicyRest change={change} />
      </TestWrapper>
    );

    await userEvent.click(screen.getByRole('option', { name: 'RHEL 8' }));
    expect(change).toBeCalledWith('osMajorVersion', 8);
  });

  it('indicates selected OS version and renders policies table', async () => {
    useSecurityGuidesOS.mockReturnValue({
      data: availableVersions,
      loading: false,
      error: undefined,
    });
    useSupportedProfiles.mockReturnValue({
      data: { data: [] },
      loading: false,
      error: undefined,
    });
    render(
      <TestWrapper>
        <CreateSCAPPolicyRest change={change} selectedOsMajorVersion={8} />
      </TestWrapper>
    );

    expect(screen.getByRole('option', { name: 'RHEL 8' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    screen.getByLabelText('PolicyTypeTable');
  });

  it('shows available supported profiles', async () => {
    useSecurityGuidesOS.mockReturnValue({
      data: availableVersions,
      loading: false,
      error: undefined,
    });
    useSupportedProfiles.mockReturnValue({
      data: { data: supportedProfiles },
      loading: false,
      error: undefined,
    });
    render(
      <TestWrapper>
        <CreateSCAPPolicyRest change={change} selectedOsMajorVersion={8} />
      </TestWrapper>
    );

    supportedProfiles.forEach(({ title }) => {
      screen.getByRole('cell', { name: title });
    });
  });

  it('calls the change callback on profile select', async () => {
    useSecurityGuidesOS.mockReturnValue({
      data: availableVersions,
      loading: false,
      error: undefined,
    });
    useSupportedProfiles.mockReturnValue({
      data: { data: supportedProfiles },
      loading: false,
      error: undefined,
    });
    render(
      <TestWrapper>
        <CreateSCAPPolicyRest change={change} selectedOsMajorVersion={8} />
      </TestWrapper>
    );

    await userEvent.click(
      screen.getByRole('radio', {
        name: /select row 0/i,
      })
    );
    expect(change).toBeCalledTimes(4);
  });
});
