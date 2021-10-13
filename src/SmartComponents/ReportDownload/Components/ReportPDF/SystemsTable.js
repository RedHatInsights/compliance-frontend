import React from 'react';
import propTypes from 'prop-types';
// eslint-disable-next-line rulesdir/disallow-fec-relative-imports
import { Table } from '@redhat-cloud-services/frontend-components-pdf-generator';
import { fixedPercentage } from 'Utilities/TextHelper';
import { complianceScoreData } from 'Utilities/ruleHelpers';

const SystemsTable = ({ systems }) => {
  const headerRow = ['System name', 'OS', 'Failed rules', 'Compliance score'];
  const rows = systems.map((system) => [
    system.name,
    `RHEL ${system.osMajorVersion}.${system.osMinorVersion}`,
    `${complianceScoreData(system.testResultProfiles).rulesFailed || ''}`,
    fixedPercentage(complianceScoreData(system.testResultProfiles).score),
  ]);

  return <Table withHeader rows={[headerRow, ...rows]} />;
};

SystemsTable.propTypes = {
  systems: propTypes.array,
};

export default SystemsTable;
