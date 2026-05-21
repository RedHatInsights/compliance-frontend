import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import { useComplianceChrome as useComplianceChromeHcc } from './useComplianceChrome.hcc';
import { useComplianceChrome as useComplianceChromeIop } from './useComplianceChrome.iop';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const setIopChrome = (chrome) => {
  window.insights = { chrome };
};

describe('useComplianceChrome (HCC build)', () => {
  it('delegates hideGlobalFilter to raw chrome', () => {
    const hideGlobalFilter = jest.fn();
    const rawChrome = { hideGlobalFilter };
    useChrome.mockImplementation((selector) =>
      typeof selector === 'function' ? selector(rawChrome) : rawChrome,
    );

    let chromeApi;
    const Probe = () => {
      chromeApi = useComplianceChromeHcc();
      return null;
    };
    render(<Probe />);

    chromeApi.hideGlobalFilter(true);
    expect(hideGlobalFilter).toHaveBeenCalledWith(true);
    expect(useChrome).toHaveBeenCalled();
  });

  it('does not throw when hideGlobalFilter is missing', () => {
    useChrome.mockReturnValue({});

    let chromeApi;
    const Probe = () => {
      chromeApi = useComplianceChromeHcc();
      return null;
    };
    render(<Probe />);

    expect(() => chromeApi.hideGlobalFilter(true)).not.toThrow();
  });
});

describe('useComplianceChrome (IoP build)', () => {
  const originalInsights = window.insights;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.insights = originalInsights;
  });

  it('does not use useChrome and hideGlobalFilter is a no-op', () => {
    const hideGlobalFilter = jest.fn();
    setIopChrome({ hideGlobalFilter });

    let chromeApi;
    const Probe = () => {
      chromeApi = useComplianceChromeIop();
      return null;
    };
    render(<Probe />);

    expect(chromeApi.hideGlobalFilter(true)).toBeUndefined();
    expect(hideGlobalFilter).not.toHaveBeenCalled();
    expect(useChrome).not.toHaveBeenCalled();
  });

  it('sets document.title when updateDocumentTitle is missing', () => {
    const originalTitle = document.title;
    setIopChrome({});

    let chromeApi;
    const Probe = () => {
      chromeApi = useComplianceChromeIop();
      return null;
    };
    render(<Probe />);

    chromeApi.updateDocumentTitle('IoP title');
    expect(document.title).toBe('IoP title');
    document.title = originalTitle;
  });

  it('requestPdf is not available on IoP', () => {
    setIopChrome({ requestPdf: jest.fn(() => 'ok') });

    let chromeApi;
    const Probe = () => {
      chromeApi = useComplianceChromeIop();
      return null;
    };
    render(<Probe />);

    expect(chromeApi.requestPdf({})).toBeUndefined();
  });
});
