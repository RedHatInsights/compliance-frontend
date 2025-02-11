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
    system.display_name,
    `RHEL ${system.os_major_version}.${system.os_minor_version}`,
    system.security_guide_version,
    ssgFinder(system.os_major_version, system.os_minor_version),
  ]);

  return <Table withHeader rows={[headerRow, ...rows]} />;
};

UnsupportedSystemsTable.propTypes = {
  systems: propTypes.array,
  ssgFinder: propTypes.func,
};

export default UnsupportedSystemsTable;
