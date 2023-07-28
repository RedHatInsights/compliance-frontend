import { render } from '@testing-library/react';
import { useQuery } from '@apollo/client';
import buildProfiles from '@/__factories__/profiles.js';
import { CreateSCAPPolicy } from './CreateSCAPPolicy.js';

jest.mock('@apollo/client');

describe('CreateSCAPPolicy', () => {
  const defaultProps = {
    change: () => ({}),
    selectedProfile: undefined,
    selectedOsMajorVersion: undefined,
  };

  const builtProfiles = buildProfiles();
  const profiles = {
    edges: builtProfiles.map((profile) => ({
      node: profile,
    })),
  };

  const osMajorVersions = {
    edges: [6, 7, 8].map((osMajorVersion) => {
      return {
        node: {
          osMajorVersion,
          profiles: {
            edges: builtProfiles.map((profile) => ({
              ...profile,
              supportedOsVersions: [1, 2, 3, 4].map(
                (minorVersion) => `${osMajorVersion}.${minorVersion}`
              ),
              benchmark: {
                id: `${osMajorVersion}-benchmark-id`,
                refId: `${osMajorVersion}-benchmark-refId`,
                osMajorVersion,
              },
            })),
          },
        },
      };
    }),
  };

  it('expect to render without error', () => {
    useQuery.mockImplementation(() => ({
      data: {},
      error: false,
      loading: false,
    }));
    const { asFragment } = render(<CreateSCAPPolicy {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render a spinner while loading', () => {
    useQuery.mockImplementation(() => ({
      data: {},
      error: false,
      loading: true,
    }));
    const { asFragment } = render(<CreateSCAPPolicy {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render benchmarks and no policies until one is selected', () => {
    useQuery.mockImplementation(() => ({
      data: { osMajorVersions },
      error: false,
      loading: false,
    }));
    const { asFragment } = render(<CreateSCAPPolicy {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render policies from the selected benchmark only', () => {
    useQuery.mockImplementation(() => ({
      data: { osMajorVersions, profiles },
      error: false,
      loading: false,
    }));
    const { asFragment } = render(<CreateSCAPPolicy {...defaultProps} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
