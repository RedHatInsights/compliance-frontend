import { buildAppConfig } from '@/config/appConfig';
import { getAppConfig } from '@/config/appConfig';
import { isIopApiMocksEnabled } from './iopApiMocksEnabled';

jest.mock('@/config/appConfig', () => {
  const actual = jest.requireActual('@/config/appConfig');
  return {
    ...actual,
    getAppConfig: jest.fn(),
  };
});

describe('isIopApiMocksEnabled', () => {
  it('is false on HCC', () => {
    getAppConfig.mockReturnValue(buildAppConfig('hcc'));
    expect(isIopApiMocksEnabled()).toBe(false);
  });

  it('is true on IoP', () => {
    getAppConfig.mockReturnValue(buildAppConfig('iop'));
    expect(isIopApiMocksEnabled()).toBe(true);
  });
});
