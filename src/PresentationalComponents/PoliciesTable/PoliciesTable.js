import React from 'react';
import propTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { BackgroundLink, emptyRows } from 'PresentationalComponents';
import { TableToolsTable } from 'Utilities/hooks/useTableTools';
import * as Columns from './Columns';

const FILTER_CONFIGURATION = [
    {
        type: conditionalFilterType.text,
        label: 'Name',
        filter: (policies, value) => (
            policies.filter((policy) => policy.name.includes(value))
        )
    }
];

const PoliciesTable = ({ policies, location, history }) => {
    const columns = Object.values(Columns);

    const actionResolver = () => ([
        {
            title: 'Delete policy',
            onClick: (_event, _index, { itemId: policyId }) => {
                const policy = policies.find((policy) => (
                    policy.id === policyId
                ));
                this.props.history.push(`/scappolicies/${ policyId }/delete`, {
                    policy,
                    background: location
                });
            }
        },
        {
            title: 'Edit policy',
            onClick: (_event, _index, { itemId: policyId }) => {
                const policy = policies.find((policy) => (
                    policy.id === policyId
                ));
                history.push(`/scappolicies/${ policyId }/edit`, {
                    policy,
                    background: location,
                    state: { policy }
                });
            }
        }
    ]);

    return <TableToolsTable
        aria-label='Policies'
        ouiaId="PoliciesTable"
        className='compliance-policies-table'
        columns={ columns }
        items={ policies }
        emptyRows={ emptyRows }
        filters={{
            filterConfig: FILTER_CONFIGURATION
        }}
        options={{
            dedicatedAction: () => ( // eslint-disable-line
                <BackgroundLink to='/scappolicies/new'>
                    <Button variant='primary' ouiaId="CreateNewPolicyButton">Create new policy</Button>
                </BackgroundLink>
            )
        }}
        actionResolver={ actionResolver } />;
};

PoliciesTable.propTypes = {
    policies: propTypes.array.isRequired,
    history: propTypes.object.isRequired,
    location: propTypes.object.isRequired
};

PoliciesTable.defaultProps = {
    policies: []
};

export default withRouter(PoliciesTable);
