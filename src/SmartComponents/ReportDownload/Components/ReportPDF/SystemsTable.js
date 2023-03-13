import React from 'react';
import propTypes from 'prop-types';
// eslint-disable-next-line rulesdir/disallow-fec-relative-imports
import { Table } from '@redhat-cloud-services/frontend-components-pdf-generator/dist/esm/index';
import { fixedPercentage } from 'Utilities/TextHelper';

const SystemsTable = ({ systems }) => {
  const headerRow = ['System name', 'OS', 'Failed rules', 'Compliance score'];
  const rows = systems.map((system) => [
    system.name,
    `RHEL ${system.osMajorVersion}.${system.osMinorVersion}`,
    `${system.testResultProfiles[0].rulesFailed || ''}`,
    fixedPercentage(system.testResultProfiles[0].score),
  ]);

  return <Table withHeader rows={[headerRow, ...rows]} />;
};

SystemsTable.propTypes = {
  systems: propTypes.array,
};

export default SystemsTable;
