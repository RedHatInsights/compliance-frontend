import React from 'react';

import propTypes from 'prop-types';
// eslint-disable-next-line
import { Table } from '@redhat-cloud-services/frontend-components-pdf-generator';

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
    system.testResultProfiles[0].ssgVersion,
    ssgFinder(system.osMajorVersion, system.osMinorVersion),
  ]);
  console.log(rows);
  return <Table withHeader rows={[headerRow, ...rows]} />;
};

UnsupportedSystemsTable.propTypes = {
  systems: propTypes.array,
  ssgFinder: propTypes.func,
};

export default UnsupportedSystemsTable;
