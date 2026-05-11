import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useComplianceChrome } from './useComplianceChrome';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/config/appConfig', () => ({
  readEnvTarget: jest.fn(() => 'hcc'),
  buildAppConfig: jest.fn(() => ({
    chrome: { useDocumentTitleFallback: false },
  })),
}));

describe('useComplianceChrome', () => {
  it('delegates hideGlobalFilter to raw chrome', () => {
    const hideGlobalFilter = jest.fn();
    useChrome.mockReturnValue({ hideGlobalFilter });

    let chromeApi;
    const Probe = () => {
      chromeApi = useComplianceChrome();
      return null;
    };
    render(<Probe />);

    chromeApi.hideGlobalFilter(true);
    expect(hideGlobalFilter).toHaveBeenCalledWith(true);
  });
});
