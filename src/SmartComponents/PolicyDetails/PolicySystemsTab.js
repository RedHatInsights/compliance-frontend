/* eslint-disable react/display-name */
import React from 'react';
import propTypes from 'prop-types';
import { InventoryTable } from 'SmartComponents';
import { GET_SYSTEMS } from '../SystemsTable/constants';
import { Link } from 'react-router-dom';
import { Cells } from '@/SmartComponents/SystemsTable/SystemsTable';
import useFeature from 'Utilities/hooks/useFeature';

const PolicySystemsTab = ({ policy, systemTableProps }) => {
	let showSsgVersions = useFeature('showSsgVersions');

    <InventoryTable
        query={GET_SYSTEMS}
        policyId={ policy.id }
        defaultFilter={`policy_id = ${policy.id}`}
        showActions={ false }
        remediationsEnabled={ false }
        columns={[{
            key: 'display_name',
            title: 'System name',
            renderFunc: (name, id) => <Link to={{ pathname: `/systems/${id}` }}> {name} </Link>,
            props: {
                width: 40, isStatic: true
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
    />;
};

PolicySystemsTab.propTypes = {
    policy: propTypes.shape({
        id: propTypes.string.isRequired,
        complianceThreshold: propTypes.number.isRequired
    }),
    systemTableProps: propTypes.object
};

export default PolicySystemsTab;
