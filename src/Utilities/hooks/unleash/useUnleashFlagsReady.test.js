describe('useUnleashFlagsReady', () => {
  const originalIop = process.env.IOP;

  afterEach(() => {
    process.env.IOP = originalIop;
    jest.resetModules();
  });

  it('uses the HCC hook when IOP is not true', () => {
    process.env.IOP = 'false';
    jest.resetModules();

    const selected = require('./useUnleashFlagsReady').default;
    const hcc = require('./useUnleashFlagsReady.hcc').default;

    expect(selected).toBe(hcc);
  });

  it('uses the IoP hook when IOP is true', () => {
    process.env.IOP = 'true';
    jest.resetModules();

    const selected = require('./useUnleashFlagsReady').default;
    const iop = require('./useUnleashFlagsReady.iop').default;

    expect(selected).toBe(iop);
  });
});
