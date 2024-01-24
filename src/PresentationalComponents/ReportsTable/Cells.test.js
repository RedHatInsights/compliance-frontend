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
    render(
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

    expect(screen.getByText('POLICY_NAME')).toBeInTheDocument();
  });
});

describe('OperatingSystem', () => {
  const defaultProps = {
    osMajorVersion: '7',
  };

  it('expect to render with SSG version', () => {
    render(
      <OperatingSystem
        {...defaultProps}
        benchmark={{ version: '1.2.3' }}
        policy={null}
        unsupportedHostCount={0}
      />
    );

    expect(screen.getByText('RHEL 7')).toBeInTheDocument();
    expect(screen.getByText('SSG: 1.2.3')).toBeInTheDocument();
  });

  it('expect to render with unsupported warning', () => {
    render(
      <OperatingSystem
        {...defaultProps}
        benchmark={{ version: '1.2.3' }}
        unsupportedHostCount={3}
        policy={null}
      />
    );

    expect(screen.getByLabelText("Unsupported SSG Version warning")).toBeInTheDocument();
  });
});

describe('CompliantSystems', () => {
  const deftaultProps = {
    testResultHostCount: 10,
    compliantHostCount: 9,
  };

  it('expect to render with unsupported hosts', () => {
    render(
      <CompliantSystems {...deftaultProps} unsupportedHostCount={42} />
    );

    expect(screen.getByLabelText("Report chart")).toBeInTheDocument();
  });
});

describe('PDFExportDownload', () => {
  it('expect to render without error', () => {
    render(<PDFExportDownload id="ID1" />);

    expect(screen.getByLabelText("Reports PDF download link")).toBeInTheDocument();
  });
});
