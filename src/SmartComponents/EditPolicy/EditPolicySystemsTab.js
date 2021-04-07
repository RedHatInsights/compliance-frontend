import React from 'react';
import propTypes from 'prop-types';
import useFeature from 'Utilities/hooks/useFeature';
import { systemName } from 'Store/Reducers/SystemStore';
import { InventoryTable, SystemsTable } from 'SmartComponents';
import { GET_SYSTEMS_WITHOUT_FAILED_RULES } from '../SystemsTable/constants';

const EditPolicySystems = ({ policy }) => {
    const newInventory = useFeature('newInventory');
    const InvCmp = newInventory ? InventoryTable : SystemsTable;

    const columns = [
        {
            key: 'facts.compliance.display_name',
            title: 'Name',
            props: {
                width: 40, isStatic: true
            },
            ...newInventory && {
                key: 'display_name',
                renderFunc: (displayName, id, extra) => {
                    return extra?.lastScanned ? systemName(displayName, id, { name: extra?.name }) : displayName;
                }
            }
        },
        {
            key: 'facts.compliance.osMinorVersion',
            title: 'Operating system',
            props: {
                width: 40, isStatic: true
            },
            ...newInventory && {
                key: 'osMinorVersion',
                renderFunc: (osMinorVersion, _id, { osMajorVersion }) => `RHEL ${osMajorVersion}.${osMinorVersion}`
            }
        }
    ];

    return (
        <InvCmp
            compact
            showActions={ false }
            enableExport={ false }
            remediationsEnabled={ false }
            policyId={ policy.id }
            defaultFilter={ `os_major_version = ${policy.majorOsVersion}` }
            query={GET_SYSTEMS_WITHOUT_FAILED_RULES}
            columns={columns}
            preselectedSystems={ (policy?.hosts || []).map((h) => ({ id: h.id })) || [] } />
    );
};

EditPolicySystems.propTypes = {
    policy: propTypes.shape({
        id: propTypes.number,
        majorOsVersion: propTypes.number,
        hosts: propTypes.arrayOf(propTypes.shape({
            id: propTypes.number
        }))
    })
};

export default EditPolicySystems;
