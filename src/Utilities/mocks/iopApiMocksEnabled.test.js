import { getAppConfig } from '@/config/appConfig';
import { getAppConfigHcc } from '@/config/appConfig.hcc';
import { getAppConfigIop } from '@/config/appConfig.iop';
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
    getAppConfig.mockReturnValue(getAppConfigHcc());
    expect(isIopApiMocksEnabled()).toBe(false);
  });

  it('is true on IoP', () => {
    getAppConfig.mockReturnValue(getAppConfigIop());
    expect(isIopApiMocksEnabled()).toBe(true);
  });
});
