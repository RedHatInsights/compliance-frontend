import React, { useMemo } from 'react';
import { faker } from '@faker-js/faker';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import { ComplianceTable } from 'PresentationalComponents';
import useTailoringRules from 'Utilities/hooks/api/useTailoringRules';

import DifferingOnlyToggle from './components/DifferingOnlyToggle';
import RuleRow from './components/RuleRow';

import columns, { profileVersion } from './columns';
import filters from './filters';

const ComparisonTable = ({ tailoringId, policyId }) => {
  // TODO Replace with actual comparison endpoint(s)
  const {
    data: { data: tailoringRules, meta: { total } = {} } = {},
    error,
    loading,
  } = useTailoringRules({
    params: {
      policyId,
      tailoringId,
    },
    useTableState: true,
    skip: !tailoringId && !policyId,
  });
  const allColumns = useMemo(
    () => [
      ...columns,
      profileVersion('8.8', '0.1.66', { isDisabled: true }),
      profileVersion('8.10', '0.1.72'),
    ],
    [],
  );
  const sourceVersion = {
    os_minor_version: 8,
    os_major_version: 8,
    ssg_version: '0.1.66',
  };
  const targetVersion = {
    os_minor_version: 8,
    os_major_version: 10,
    ssg_version: '0.1.72',
  };
  const items = useMemo(() => {
    return tailoringRules?.map((item) => {
      const available_in_versions = faker.helpers.arrayElements(
        [sourceVersion, targetVersion],
        { min: 1, max: 2 },
      );
      const isDeprecated = available_in_versions.find(
        ({ os_major_version, os_minor_version, ssg_version }) => {
          !(
            os_major_version === targetVersion.os_major_version &&
            os_minor_version === targetVersion.os_minor_version &&
            ssg_version !== targetVersion.ssg_version
          ) &&
            os_major_version === sourceVersion.os_major_version &&
            os_minor_version === sourceVersion.os_minor_version &&
            ssg_version === sourceVersion.ssg_version;
        },
      );
      const isNew = available_in_versions.find(
        ({ os_major_version, os_minor_version, ssg_version }) => {
          os_major_version === targetVersion.os_major_version &&
            os_minor_version === targetVersion.os_minor_version &&
            ssg_version === targetVersion.ssg_version &&
            !(
              os_major_version === sourceVersion.os_major_version &&
              os_minor_version === sourceVersion.os_minor_version &&
              ssg_version === sourceVersion.ssg_version
            );
        },
      );
      console.log('available_in_versions', available_in_versions);
      return {
        ...item,
        isNew,
        isDeprecated,
        available_in_versions,
      };
    });
  }, [tailoringRules]);

  console.log('allColumns', allColumns);
  return (
    <ComplianceTable
      variant="compact"
      columns={allColumns}
      loading={loading}
      items={items}
      total={total}
      error={error}
      filters={{
        filterConfig: filters,
      }}
      options={{
        dedicatedAction: DifferingOnlyToggle,
      }}
      rowWrapper={RuleRow}
    />
  );
};

const ComparisonTableWithProvider = (props) => {
  return (
    <TableStateProvider>
      <ComparisonTable {...props} />
    </TableStateProvider>
  );
};

export default ComparisonTableWithProvider;
