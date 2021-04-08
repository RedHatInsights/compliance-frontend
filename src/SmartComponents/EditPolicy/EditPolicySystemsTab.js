import React from 'react';
import propTypes from 'prop-types';
import useFeature from 'Utilities/hooks/useFeature';
import { Alert, AlertActionLink } from '@patternfly/react-core';
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
        <>
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
            <Alert
                variant="info"
                isInline
                title="You selected a system that has a release version previously not included in this policy."
                actionLinks={
                    <AlertActionLink>Save system changes, and open rule editing</AlertActionLink>
                }>
                <p>If you have edited any rules for this policy, you will need to do so for this release version as well.</p>
            </Alert>
        </>

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
