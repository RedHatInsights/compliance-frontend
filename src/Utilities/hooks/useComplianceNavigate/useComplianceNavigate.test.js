import { renderHook } from '@testing-library/react';
import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { useNavigate } from 'react-router-dom';

import useComplianceNavigateHcc from './useComplianceNavigate.hcc';
import useComplianceNavigateIop from './useComplianceNavigate.iop';

jest.mock('@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate', () =>
  jest.fn(),
);

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('useComplianceNavigate (HCC build)', () => {
  const insightsNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useInsightsNavigate.mockReturnValue(insightsNavigate);
  });

  it('delegates to useInsightsNavigate', () => {
    const { result } = renderHook(() => useComplianceNavigateHcc('compliance'));
    result.current('/scappolicies/new', true);

    expect(insightsNavigate).toHaveBeenCalledWith('/scappolicies/new', true);
  });
});

describe('useComplianceNavigate (IoP build)', () => {
  const routerNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(routerNavigate);
  });

  it('calls router navigate with mapped path', () => {
    const { result } = renderHook(() => useComplianceNavigateIop());
    result.current('/scappolicies/new');

    expect(routerNavigate).toHaveBeenCalledWith(
      '/insights_compliance/scappolicies/new',
    );
  });
});
