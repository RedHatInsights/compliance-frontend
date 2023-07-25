import React from 'react';
import propTypes from 'prop-types';
// eslint-disable-next-line rulesdir/disallow-fec-relative-imports
import { Table } from '@redhat-cloud-services/frontend-components-pdf-generator/dist/esm/index';

const UnsupportedSystemsTable = ({ systems, ssgFinder }) => {
  const headerRow = [
    'System name',
    'OS',
    'Running SSG version',
    'Expected SSG version',
  ];
  const rows = systems.map((system) => [
    system.name,
    `RHEL ${system.osMajorVersion}.${system.osMinorVersion}`,
    system.testResultProfiles[0]?.benchmark.version,
    ssgFinder(system.osMajorVersion, system.osMinorVersion),
  ]);

  return <Table withHeader rows={[headerRow, ...rows]} />;
};

UnsupportedSystemsTable.propTypes = {
  systems: propTypes.array,
  ssgFinder: propTypes.func,
};

export default UnsupportedSystemsTable;
