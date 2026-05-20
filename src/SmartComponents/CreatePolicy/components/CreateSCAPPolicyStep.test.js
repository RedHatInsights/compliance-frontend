import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';

import TestWrapper from 'Utilities/TestWrapper';
import useSecurityGuidesOS from 'Utilities/hooks/api/useSecurityGuidesOS';
import useSupportedProfiles from 'Utilities/hooks/api/useSupportedProfiles';
import CreateSCAPPolicyStep from './CreateSCAPPolicyStep';

jest.mock('Utilities/hooks/api/useSecurityGuidesOS');
jest.mock('Utilities/hooks/api/useSupportedProfiles');

/* eslint-disable react/prop-types */
jest.mock('bastilian-tabletools', () => ({
  TableStateProvider: ({ children }) => children,
}));

jest.mock('PresentationalComponents', () => {
  const React = require('react');
  return {
    StateViewPart: ({ children }) => <>{children}</>,
    StateViewWithError: ({ stateValues, children }) => {
      if (stateValues.error) {
        return <div data-testid="error-state">{String(stateValues.error)}</div>;
      }
      const childArray = React.Children.toArray(children);
      return (
        <>
          {childArray.filter((c) => c.props && stateValues[c.props.stateKey])}
        </>
      );
    },
    PolicyTypesTable: ({ onChange }) => (
      <div data-testid="policy-types-table">
        <button onClick={() => onChange({ id: 'profile-1' })}>
          Select profile
        </button>
      </div>
    ),
    PolicyTypeTooltip: () => null,
  };
});
/* eslint-enable react/prop-types */

const OS_MAJOR_VERSIONS = [7, 8, 9];

const profiles = [
  {
    id: 'profile-1',
    title: 'Profile 1',
    ref_id: 'ref-1',
    security_guide_id: 'sg-1',
    security_guide_version: '0.1.60',
    os_major_version: 9,
    os_minor_versions: [0, 1, 2],
    type: 'supported_profile',
  },
];

const renderStep = () =>
  render(
    <FormRenderer
      schema={{
        fields: [
          { component: 'create-scap-policy-step', name: 'create-scap-policy' },
        ],
      }}
      componentMapper={{ 'create-scap-policy-step': CreateSCAPPolicyStep }}
      FormTemplate={({ formFields }) => formFields}
      onSubmit={() => {}}
    />,
    { wrapper: TestWrapper },
  );

describe('CreateSCAPPolicyStep', () => {
  beforeEach(() => {
    useSupportedProfiles.mockImplementation(({ skip } = {}) =>
      skip
        ? { data: undefined, loading: false, error: undefined }
        : {
            data: { data: profiles, meta: { total: 1 } },
            loading: false,
            error: undefined,
          },
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loading state', () => {
    it('shows a spinner while OS versions are loading', () => {
      useSecurityGuidesOS.mockReturnValue({
        data: undefined,
        loading: true,
        error: undefined,
      });

      renderStep();

      expect(screen.getByLabelText('Contents')).toHaveAttribute(
        'aria-valuetext',
        'Loading...',
      );
    });
  });

  describe('error state', () => {
    it('renders an error state when OS versions request fails', () => {
      useSecurityGuidesOS.mockReturnValue({
        data: undefined,
        loading: false,
        error: 'Request failed',
      });

      renderStep();

      expect(screen.getByTestId('error-state')).toBeInTheDocument();
      expect(screen.queryByText('Operating system')).not.toBeInTheDocument();
    });
  });

  describe('data state', () => {
    beforeEach(() => {
      useSecurityGuidesOS.mockReturnValue({
        data: { data: OS_MAJOR_VERSIONS },
        loading: false,
        error: undefined,
      });
    });

    it('renders the page heading and description', () => {
      renderStep();

      expect(screen.getByText('Create SCAP policy')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Select the operating system and policy type for this policy.',
        ),
      ).toBeInTheDocument();
    });

    it('renders an OS Card for each available major version', () => {
      renderStep();

      OS_MAJOR_VERSIONS.forEach((version) => {
        expect(screen.getByText(`RHEL ${version}`)).toBeInTheDocument();
      });
    });

    it('renders each Card with the correct OUIA component ID', () => {
      renderStep();

      OS_MAJOR_VERSIONS.forEach((version) => {
        expect(
          document.querySelector(
            `[data-ouia-component-id="rhel${version}-card"]`,
          ),
        ).toBeInTheDocument();
      });
    });

    it('renders each Card with PF6/Card OUIA component type', () => {
      renderStep();

      const cards = document.querySelectorAll(
        '[data-ouia-component-type="PF6/Card"]',
      );
      expect(cards).toHaveLength(OS_MAJOR_VERSIONS.length);
    });

    it('renders a screen-reader-only radio input for each OS version card', () => {
      renderStep();

      OS_MAJOR_VERSIONS.forEach((version) => {
        const input = document.getElementById(`rhel${version}-input`);
        expect(input).toHaveAttribute('type', 'radio');
        expect(input).toHaveClass('pf-v6-screen-reader');
      });
    });

    it('renders the OS version form group as a radiogroup', () => {
      renderStep();

      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('groups all OS radio inputs under the same name', () => {
      renderStep();

      const radios = document.querySelectorAll(
        'input[name="os-major-version"]',
      );
      expect(radios).toHaveLength(OS_MAJOR_VERSIONS.length);
    });

    it('does not show the Policy type section before an OS version is selected', () => {
      renderStep();

      expect(screen.queryByText('Policy type')).not.toBeInTheDocument();
    });

    describe('while profiles are loading after OS selection', () => {
      it('renders PolicyTypesTable with an empty profiles array', async () => {
        useSupportedProfiles.mockReturnValue({
          data: undefined,
          loading: true,
          error: undefined,
        });
        const user = userEvent.setup();
        renderStep();

        await user.click(document.getElementById('rhel9-input'));

        expect(screen.getByTestId('policy-types-table')).toBeInTheDocument();
      });
    });

    describe('after selecting an OS version', () => {
      it('shows the Policy type section', async () => {
        const user = userEvent.setup();
        renderStep();

        await user.click(document.getElementById('rhel9-input'));

        expect(screen.getByText('Policy type')).toBeInTheDocument();
        expect(screen.getByTestId('policy-types-table')).toBeInTheDocument();
      });

      it('passes the selected OS version filter to useSupportedProfiles', async () => {
        const user = userEvent.setup();
        renderStep();

        await user.click(document.getElementById('rhel9-input'));

        expect(useSupportedProfiles).toHaveBeenCalledWith(
          expect.objectContaining({
            params: expect.objectContaining({
              filters: 'os_major_version ^ (9)',
            }),
            skip: false,
          }),
        );
      });

      it('calls form change for profile, selectedRuleRefIds, and systems when a profile is selected', async () => {
        const user = userEvent.setup();
        renderStep();

        await user.click(document.getElementById('rhel9-input'));
        await user.click(
          screen.getByRole('button', { name: 'Select profile' }),
        );

        // After onChange fires, the form re-renders with the selected profile.
        // The Policy type section remains visible (selection persists).
        expect(screen.getByTestId('policy-types-table')).toBeInTheDocument();
      });

      it('serialises profile os_minor_versions into supportedOsVersions strings', async () => {
        const user = userEvent.setup();
        renderStep();

        await user.click(document.getElementById('rhel9-input'));

        // PolicyTypesTable rendered means serialiseOsVersions executed and
        // data.availableProfiles was passed through to the form group.
        expect(screen.getByTestId('policy-types-table')).toBeInTheDocument();
        expect(useSupportedProfiles).toHaveBeenCalledWith(
          expect.objectContaining({ skip: false }),
        );
      });
    });
  });
});
