import React from 'react';
import propTypes from 'prop-types';
// eslint-disable-next-line rulesdir/disallow-fec-relative-imports
import { Table } from '@redhat-cloud-services/frontend-components-pdf-generator/dist/esm/index';

const NonReportedSystemsTable = ({ systems }) => {
  const headerRow = ['System name', 'OS'];
  const rows = systems.map((system) => [
    system.name,
    `RHEL ${system.osMajorVersion}.${system.osMinorVersion}`,
  ]);

  return <Table withHeader rows={[headerRow, ...rows]} />;
};

NonReportedSystemsTable.propTypes = {
  systems: propTypes.array,
  ssgFinder: propTypes.func,
};

export default NonReportedSystemsTable;
