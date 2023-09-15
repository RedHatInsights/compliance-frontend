import React from 'react';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../../../SystemsTable/Columns';
import SystemsTableEmptyState from './components/SystemsTableEmptyState';
import PrependComponent from './components/PrependComponent';
import NewRulesAlert from './components/NewRulesAlert';
import useSystemsOsFilter from './hooks/useSystemsOsFilter';

const SystemsField = (props) => {
  const {
    policy,
    rulesField,
    input: { value, onChange },
  } = useFieldApi(props);
  const { getFieldState } = useFormApi();
  const showNewRulesAlert = getFieldState(rulesField)?.dirty;
  const { osMajorVersion, defaultFilter } = useSystemsOsFilter(policy);

  const onSelect = (...args) => {
    console.log('SystemSelect', ...args);
    onChange(...args);
  };
  return (
    <>
      {defaultFilter && (
        <SystemsTable
          columns={[
            Columns.Name,
            Columns.inventoryColumn('tags'),
            Columns.OperatingSystem,
          ]}
          showOsMinorVersionFilter={[osMajorVersion]}
          prependComponent={
            <PrependComponent osMajorVersion={osMajorVersion} />
          }
          emptyStateComponent={
            <SystemsTableEmptyState osMajorVersion={osMajorVersion} />
          }
          compact
          showActions={false}
          defaultFilter={defaultFilter}
          enableExport={false}
          remediationsEnabled={false}
          preselectedSystems={value.length > 0 ? value : []}
          onSelect={onSelect || (() => ({}))}
        />
      )}

      {showNewRulesAlert && <NewRulesAlert />}
    </>
  );
};

SystemsField.propTypes = {
  policy: propTypes.object,
  newRuleTabs: propTypes.bool,
  onSystemSelect: propTypes.func,
  selectedSystems: propTypes.array,
};

export default SystemsField;
