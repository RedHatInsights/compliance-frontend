describe('useFeatureFlag', () => {
  const originalIop = process.env.IOP;

  afterEach(() => {
    process.env.IOP = originalIop;
    jest.resetModules();
  });

  it('uses the HCC hook when IOP is not true', () => {
    process.env.IOP = 'false';
    jest.resetModules();

    const selected = require('./useFeatureFlag').default;
    const hcc = require('./useFeatureFlag.hcc').default;

    expect(selected).toBe(hcc);
  });

  it('uses the IoP hook when IOP is true', () => {
    process.env.IOP = 'true';
    jest.resetModules();

    const selected = require('./useFeatureFlag').default;
    const iop = require('./useFeatureFlag.iop').default;

    expect(selected).toBe(iop);
  });
});
