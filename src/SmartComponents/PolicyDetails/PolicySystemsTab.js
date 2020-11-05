/* eslint-disable react/display-name */
import React from 'react';
import propTypes from 'prop-types';
import { InventoryTable, SystemsTable } from 'SmartComponents';
import { GET_SYSTEMS } from '../SystemsTable/constants';
import { Link } from 'react-router-dom';
import { Cells } from '@/SmartComponents/SystemsTable/SystemsTable';
import useFeature from 'Utilities/hooks/useFeature';

const PolicySystemsTab = ({ policy, systemTableProps }) => {
    const newInventory = useFeature('newInventory');
    let showSsgVersions = useFeature('showSsgVersions');
	const InvCmp = newInventory ? InventoryTable : SystemsTable;
	
    return (
        <InvCmp
            query={GET_SYSTEMS}
            policyId={ policy.id }
            defaultFilter={`policy_id = ${policy.id}`}
            showActions={ false }
            remediationsEnabled={ false }
            columns={[{
                key: 'facts.compliance.display_name',
                title: 'System name',
                props: {
                    width: 40, isStatic: true
                },
                ...newInventory && {
                    key: 'display_name',
                    renderFunc: (name, id) => <Link to={{ pathname: `/systems/${id}` }}> {name} </Link>
                }
            }, ...showSsgVersions ? [{
            	key: 'facts.compliance',
            	title: 'SSG version',
            	renderFunc: (profile) => (
               		<Cells.SSGVersion { ...{ profile } } />
            	)
        	}] : []]}
            complianceThreshold={ policy.complianceThreshold }
            { ...systemTableProps }
        />
    );
};

PolicySystemsTab.propTypes = {
    policy: propTypes.shape({
        id: propTypes.string.isRequired,
        complianceThreshold: propTypes.number.isRequired
    }),
    systemTableProps: propTypes.object
};

export default PolicySystemsTab;
