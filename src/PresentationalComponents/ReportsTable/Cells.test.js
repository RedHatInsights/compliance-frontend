import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
  Name,
  OperatingSystem,
  CompliantSystems,
  PDFExportDownload,
} from './Cells';

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate',
  () => () => ({})
);

jest.mock('@redhat-cloud-services/frontend-components/InsightsLink', () => ({
  __esModule: true,
  default: ({ children, isDisabled, ...props }) => {
    return (
      <a {...props} disabled={isDisabled}>
        {children}
      </a>
    );
  },
}));

describe('Name', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(
      <Name
        {...{
          id: 'ID',
          name: 'NAME',
          policyType: 'POLICY_TYPE',
          policy: {
            id: 'POLICY_ID',
            name: 'POLICY_NAME',
          },
        }}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('OperatingSystem', () => {
  const defaultProps = {
    osMajorVersion: '7',
  };

  it('expect to render without error', () => {
    const { asFragment } = render(<OperatingSystem {...defaultProps} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render with SSG version', () => {
    const { asFragment } = render(
      <OperatingSystem
        {...defaultProps}
        benchmark={{ version: '1.2.3' }}
        policy={null}
        unsupportedHostCount={0}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render with unsupported warning', () => {
    const { asFragment } = render(
      <OperatingSystem
        {...defaultProps}
        benchmark={{ version: '1.2.3' }}
        unsupportedHostCount={3}
        policy={null}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('CompliantSystems', () => {
  const deftaultProps = {
    testResultHostCount: 10,
    compliantHostCount: 9,
  };

  it('expect to render without error', () => {
    const { asFragment } = render(<CompliantSystems {...deftaultProps} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render with unsupported hosts', () => {
    const { asFragment } = render(
      <CompliantSystems {...deftaultProps} unsupportedHostCount={42} />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('PDFExportDownload', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<PDFExportDownload id="ID1" />);

    expect(asFragment()).toMatchSnapshot();
  });
});
