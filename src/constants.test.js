import { systemsOsMinorFilterConfiguration } from './constants';

const osMajorVersions = [
  null,
  null,
  null,
  null,
  null,
  null,
  [6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5],
];

describe('filterString', () => {
  const [{ filterString }] = systemsOsMinorFilterConfiguration(osMajorVersions);
  console.log(typeof filterString);

  it('should generate filter with all selected versions', () => {
    const filter = filterString({ 6.99: { 6.9: true } });
    expect(filter).toEqual(['(os_major_version = 6 AND os_minor_version = 9)']);
  });

  it('should generate filter with only major version', () => {
    const filter = filterString({ 7.99: { 7.99: true } });
    expect(filter).toEqual(['(os_major_version = 7)']);
  });

  it('should generate filter with correct selected versions', () => {
    const filter = filterString({ 7.99: { 7.99: true, 7.6: true } });
    expect(filter).toEqual(['(os_major_version = 7 AND os_minor_version = 6)']);
  });
});
