/* eslint-disable react/display-name */
import React from 'react';
import propTypes from 'prop-types';
import { InventoryTable } from 'SmartComponents';
import { GET_SYSTEMS } from '../SystemsTable/constants';
import { Link } from 'react-router-dom';
import Cells from '@/SmartComponents/SystemsTable/Cells';

const PolicySystemsTab = ({ policy }) => (
    <InventoryTable
        showOsMinorVersionFilter={ [policy.majorOsVersion] }
        query={GET_SYSTEMS}
        policyId={ policy.id }
        defaultFilter={`policy_id = ${policy.id}`}
        showActions={ false }
        remediationsEnabled={ false }
        columns={[{
            key: 'display_name',
            title: 'Name',
            props: {
                width: 40, isStatic: true
            },
            renderFunc: (name, id) => <Link to={{ pathname: `/systems/${id}` }}> {name} </Link>
        }, {
            key: 'ssgVersion',
            title: 'SSG version',
            renderFunc: (profile, ...rest) => {
                let realProfile = profile;
                if (typeof profile === 'string') {
                    realProfile = rest[1];
                }

                return realProfile && <Cells.SSGVersion
                    supported={ realProfile.supported }
                    ssgVersion={ realProfile?.ssg_version || realProfile?.ssgVersion } />;
            }
        }, {
            key: 'osMinorVersion',
            title: 'Operating system',
            renderFunc: (osMinorVersion, _id, { osMajorVersion }) => `RHEL ${osMajorVersion}.${osMinorVersion}`
        }]}
        complianceThreshold={ policy.complianceThreshold } />
);

PolicySystemsTab.propTypes = {
    policy: propTypes.shape({
        id: propTypes.string.isRequired,
        complianceThreshold: propTypes.number.isRequired,
        majorOsVersion: propTypes.string.isRequired
    }),
    systemTableProps: propTypes.object
};

export default PolicySystemsTab;
