import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useQuery } from '@apollo/client';
import buildProfiles from '@/__factories__/profiles.js';
import buildOSMajorVersions from '@/__factories__/osMajorVersions.js';
import { wrapInEdges } from '@/__factories__/helpers.js';

// TODO Test component with full redux(-form) context
import { CreateSCAPPolicy } from './CreateSCAPPolicy.js';

jest.mock('@apollo/client');

const defaultProps = {
  change: () => ({}),
  selectedProfile: undefined,
  selectedOsMajorVersion: undefined,
};

const profiles = wrapInEdges(buildProfiles(1));
const osMajorVersions = wrapInEdges(buildOSMajorVersions(['6', '7', '8', '9']));

describe('CreateSCAPPolicy', () => {
  it('should render a spinner while loading', () => {
    useQuery.mockImplementation(() => ({
      loading: true,
    }));
    render(<CreateSCAPPolicy {...defaultProps} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render benchmarks and no policies until one is selected', () => {
    useQuery.mockImplementation(() => ({
      data: { osMajorVersions },
      loading: false,
    }));
    render(<CreateSCAPPolicy {...defaultProps} />);

    expect(screen.queryByText('Policy type')).not.toBeInTheDocument();
  });

  it('should render policies from the selected benchmark only', () => {
    const selectedVersion =
      osMajorVersions.edges[
        Math.floor(Math.random() * osMajorVersions.edges.length)
      ];

    useQuery.mockImplementation(() => ({
      data: { osMajorVersions, profiles },
      loading: false,
    }));
    render(
      <CreateSCAPPolicy
        {...defaultProps}
        selectedOsMajorVersion={selectedVersion.node.osMajorVersion}
      />
    );

    selectedVersion.node.profiles.forEach(({ supportedOsVersions }) => {
      expect(
        screen.getAllByText(supportedOsVersions.join(', '))[0]
      ).toBeInTheDocument();
    });

    // TODO this should also query and make sure no profiles of a non selected major version are shown.
  });
});
