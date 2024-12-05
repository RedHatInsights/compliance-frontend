import React from 'react';
import { Spinner, Bullseye } from '@patternfly/react-core';

import propTypes from 'prop-types';
import AsyncTableToolsTable from '@/Frameworks/AsyncTableTools/components/AsyncTableToolsTable';
import { TableToolsTable } from 'Utilities/hooks/useTableTools';
import useAPIV2FeatureFlag from '@/Utilities/hooks/useAPIV2FeatureFlag';
import {
  paginationSerialiser,
  filtersSerialiser,
  sortSerialiser,
} from './serialisers';

/**
 * This component serves as a place to either use the non-async TableTools or the AsyncTableTools
 * And allow preparing the AsyncTableToolsTable props/options common across tables in Compliance
 *
 *  @param   {object}             props Component props
 *
 *  @returns {React.ReactElement}       Returns either a Async or non async table depending on `useAPIV2FeatureFlag`
 *
 *  @category Compliance
 *
 */
const ComplianceTable = (props) => {
  const apiV2Enabled = useAPIV2FeatureFlag();

  return apiV2Enabled === undefined ? (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ) : apiV2Enabled ? (
    <AsyncTableToolsTable
      {...props}
      options={{
        serialisers: {
          pagination: paginationSerialiser,
          filters: filtersSerialiser,
          sort: sortSerialiser,
        },
        ...props.options,
      }}
    />
  ) : (
    <TableToolsTable {...props} />
  );
};

ComplianceTable.propTypes = {
  options: propTypes.object,
};

export default ComplianceTable;
