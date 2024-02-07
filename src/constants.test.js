import { systemsOsMinorFilterConfiguration } from './constants';

describe('filterString', () => {
  const osMajorVersions = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    [8, 9, 5, 7],
    [6, 9, 8, 7],
  ];
  it('includes all minor version with only major == minor set to true in the filter object', () => {
    const [{ filterString }] =
      systemsOsMinorFilterConfiguration(osMajorVersions);
    const selectedVersions = {
      8: {
        8: true,
      },
    };

    expect(filterString(selectedVersions)).toEqual([
      '( os_major_version = 8 AND os_minor_version = 6 ) OR ( os_major_version = 8 AND os_minor_version = 7 ) OR ( os_major_version = 8 AND os_minor_version = 8 ) OR ( os_major_version = 8 AND os_minor_version = 9 )',
    ]);
  });

  it('includes all minor version with only major == minor set to true in the filter object and previously selected versions', () => {
    const [{ filterString }] =
      systemsOsMinorFilterConfiguration(osMajorVersions);
    const selectedVersions = {
      8: {
        8: true,
        8.8: true,
      },
    };

    expect(filterString(selectedVersions)).toEqual([
      '( os_major_version = 8 AND os_minor_version = 6 ) OR ( os_major_version = 8 AND os_minor_version = 7 ) OR ( os_major_version = 8 AND os_minor_version = 8 ) OR ( os_major_version = 8 AND os_minor_version = 9 )',
    ]);
  });

  it('generates correct filter string with major and minor versions equal', () => {
    const [{ filterString }] =
      systemsOsMinorFilterConfiguration(osMajorVersions);
    const selectedVersions = {
      7: {
        7.7: true,
      },
    };

    expect(filterString(selectedVersions)).toEqual([
      '( os_major_version = 7 AND os_minor_version = 7 )',
    ]);
  });

  it('generates filter string with selected minor version', () => {
    const [{ filterString }] =
      systemsOsMinorFilterConfiguration(osMajorVersions);
    const selectedVersions = {
      8: {
        8.3: true,
        8.9: true,
      },
    };

    expect(filterString(selectedVersions)).toEqual([
      '( os_major_version = 8 AND os_minor_version = 3 ) OR ( os_major_version = 8 AND os_minor_version = 9 )',
    ]);
  });

  it('excludes unselected versions', () => {
    const [{ filterString }] =
      systemsOsMinorFilterConfiguration(osMajorVersions);
    const selectedVersions = {
      8: {
        8.3: false,
        8.9: true,
      },
    };

    expect(filterString(selectedVersions)).toEqual([
      '( os_major_version = 8 AND os_minor_version = 9 )',
    ]);
  });

  it('generates filter with multiple major versions', () => {
    const [{ filterString }] =
      systemsOsMinorFilterConfiguration(osMajorVersions);
    const selectedVersions = {
      8: {
        8.9: true,
      },
      7: {
        7.9: true,
      },
    };

    expect(filterString(selectedVersions)).toEqual([
      '( os_major_version = 7 AND os_minor_version = 9 ) OR ( os_major_version = 8 AND os_minor_version = 9 )',
    ]);
  });
});
