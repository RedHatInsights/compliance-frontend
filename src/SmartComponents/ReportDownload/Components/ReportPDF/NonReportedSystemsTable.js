import React from 'react';
import propTypes from 'prop-types';
// eslint-disable-next-line rulesdir/disallow-fec-relative-imports
import { Table } from '@redhat-cloud-services/frontend-components-pdf-generator/dist/esm/index';

const NonReportedSystemsTable = ({ systems }) => {
  const headerRow = ['System name', 'OS'];
  const rows = systems.map((system) => [
    system.display_name,
    `RHEL ${system.os_major_version}.${system.os_minor_version}`,
  ]);

  return <Table withHeader rows={[headerRow, ...rows]} />;
};

NonReportedSystemsTable.propTypes = {
  systems: propTypes.array,
  ssgFinder: propTypes.func,
};

export default NonReportedSystemsTable;
