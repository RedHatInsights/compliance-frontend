import React from 'react';
import propTypes from 'prop-types';
// eslint-disable-next-line rulesdir/disallow-fec-relative-imports
import { Table } from '@redhat-cloud-services/frontend-components-pdf-generator/dist/esm/index';
import { fixedPercentage } from 'Utilities/TextHelper';

const SystemsTable = ({ systems }) => {
  const headerRow = ['System name', 'OS', 'Failed rules', 'Compliance score'];
  const rows = systems.map((system) => [
    system.display_name,
    `RHEL ${system.os_major_version}.${system.os_minor_version}`,
    `${system.failed_rule_count || ''}`,
    fixedPercentage(system.score),
  ]);

  return <Table withHeader rows={[headerRow, ...rows]} />;
};

SystemsTable.propTypes = {
  systems: propTypes.array,
};

export default SystemsTable;
