import { isIopApiMocksEnabled } from './iopApiMocksEnabled';

describe('isIopApiMocksEnabled', () => {
  const original = process.env.IOP_API_MOCKED;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.IOP_API_MOCKED;
    } else {
      process.env.IOP_API_MOCKED = original;
    }
  });

  it('is false unless IOP_API_MOCKED=true', () => {
    delete process.env.IOP_API_MOCKED;
    expect(isIopApiMocksEnabled()).toBe(false);
  });

  it('is true when IOP_API_MOCKED=true', () => {
    process.env.IOP_API_MOCKED = 'true';
    expect(isIopApiMocksEnabled()).toBe(true);
  });
});
