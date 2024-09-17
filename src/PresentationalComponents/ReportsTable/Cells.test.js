import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';

import {
  Name,
  OperatingSystem,
  CompliantSystems,
  PDFExportDownload,
} from './Cells';

jest.mock('../../Utilities/hooks/useAPIV2FeatureFlag');

describe('Name', () => {
  beforeEach(() => {
    useAPIV2FeatureFlag.mockImplementation(() => false);
  });
  it('expect to render without error', () => {
    render(
      <TestWrapper>
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
      </TestWrapper>
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
      <TestWrapper>
        <OperatingSystem
          {...defaultProps}
          benchmark={{ version: '1.2.3' }}
          policy={null}
          unsupportedHostCount={0}
        />
      </TestWrapper>
    );

    expect(screen.getByText('RHEL 7')).toBeInTheDocument();
    expect(screen.getByText('SSG: 1.2.3')).toBeInTheDocument();
  });

  it('expect to render with unsupported warning', () => {
    render(
      <TestWrapper>
        <OperatingSystem
          {...defaultProps}
          benchmark={{ version: '1.2.3' }}
          unsupportedHostCount={3}
          policy={null}
        />
      </TestWrapper>
    );

    expect(
      screen.getByLabelText('Unsupported SSG Version warning')
    ).toBeInTheDocument();
  });
});

describe('CompliantSystems', () => {
  const deftaultProps = {
    testResultHostCount: 10,
    compliantHostCount: 9,
  };

  it('expect to render with unsupported hosts', () => {
    render(
      <TestWrapper>
        <CompliantSystems {...deftaultProps} unsupportedHostCount={42} />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Report chart')).toBeInTheDocument();
  });
});

describe('PDFExportDownload', () => {
  it('expect to render without error', () => {
    render(
      <TestWrapper>
        <PDFExportDownload id="ID1" />
      </TestWrapper>
    );

    expect(
      screen.getByLabelText('Reports PDF download link')
    ).toBeInTheDocument();
  });
});

describe('NotReportedSystemsAPIv2', () => {
  beforeEach(() => {
    useAPIV2FeatureFlag.mockImplementation(() => true);
  });
  const deftaultProps = {
    totalHostCount: 10,
    testResultHostCount: 7,
    unsupportedHostCount: 2,
    compliantHostCount: 4,
  };

  it('expect to render with unsupported hosts', () => {
    render(
      <TestWrapper>
        <CompliantSystems {...deftaultProps} />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Report chart')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });
});
