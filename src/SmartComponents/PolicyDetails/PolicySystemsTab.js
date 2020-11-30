/* eslint-disable react/display-name */
import React from 'react';
import propTypes from 'prop-types';
import SystemsTable, { Cells } from '@/SmartComponents/SystemsTable/SystemsTable';
import useFeature from 'Utilities/hooks/useFeature';

const PolicySystemsTab = ({ policy, systemTableProps }) => {
    let showSsgVersions = useFeature('showSsgVersions');

    return <SystemsTable
        policyId={ policy.id }
        showActions={ false }
        remediationsEnabled={ false }
        columns={[{
            key: 'facts.compliance.display_name',
            title: 'System name',
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
