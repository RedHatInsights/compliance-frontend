import React from 'react';
import propTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import { BackgroundLink, emptyRows } from 'PresentationalComponents';
import { TableToolsTable } from 'Utilities/hooks/useTableTools';
import columns from './Columns';
import * as Filters from './Filters';

const DedicatedAction = () => (
  <div>
    <BackgroundLink to="/scappolicies/new">
      <Button variant="primary" ouiaId="CreateNewPolicyButton">
        Create new policy
      </Button>
    </BackgroundLink>
  </div>
);

export const PoliciesTable = ({ policies, location, history }) => {
  const filters = Object.values(Filters);

  const actionResolver = () => [
    {
      title: 'Delete policy',
      onClick: (_event, _index, { itemId: policyId }) => {
        const policy = policies.find((policy) => policy.id === policyId);
        history.push(`/scappolicies/${policyId}/delete`, {
          policy,
          background: location,
        });
      },
    },
    {
      title: 'Edit policy',
      onClick: (_event, _index, { itemId: policyId }) => {
        const policy = policies.find((policy) => policy.id === policyId);
        history.push(`/scappolicies/${policyId}/edit`, {
          policy,
          background: location,
          state: { policy },
        });
      },
    },
  ];

  return (
    <TableToolsTable
      aria-label="Policies"
      ouiaId="PoliciesTable"
      className="compliance-policies-table"
      columns={columns}
      items={policies}
      emptyRows={emptyRows}
      filters={{
        filterConfig: filters,
      }}
      options={{
        dedicatedAction: DedicatedAction,
      }}
      actionResolver={actionResolver}
    />
  );
};

PoliciesTable.propTypes = {
  policies: propTypes.array.isRequired,
  history: propTypes.object.isRequired,
  location: propTypes.object.isRequired,
};

PoliciesTable.defaultProps = {
  policies: [],
};

export default withRouter(PoliciesTable);
