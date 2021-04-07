import React from 'react';
import { Text, TextContent } from '@patternfly/react-core';
import { InventoryTable } from 'SmartComponents';
import { GET_SYSTEMS_WITHOUT_FAILED_RULES } from '../SystemsTable/constants';
import propTypes from 'prop-types';
import { systemName } from 'Store/Reducers/SystemStore';

const EditPolicySystemsTab = ({ osMajorVersion }) => {
    const columns = [{
        key: 'display_name',
        title: 'Name',
        props: {
            width: 40, isStatic: true
        },
        renderFunc: (displayName, id, { name }) => systemName(displayName, id, { name })
    }, {
        key: 'osMinorVersion',
        title: 'Operating system',
        props: {
            width: 40, isStatic: true
        },
        renderFunc: (osMinorVersion, _id, { osMajorVersion }) => `RHEL ${osMajorVersion}.${osMinorVersion}`
    }];

    const emptyStateComponent = (<React.Fragment>
        <TextContent className="pf-u-mb-md">
            <Text>
                You do not have any <b>RHEL { osMajorVersion }</b> systems connected to Insights and enabled for Compliance.
            </Text>
        </TextContent>
        <TextContent className="pf-u-mb-md">
            <Text>
                Connect RHEL { osMajorVersion } systems to Insights.
            </Text>
        </TextContent>
    </React.Fragment>);

    const prependComponent = (<React.Fragment>
        <TextContent className="pf-u-mb-md">
            <Text>
                Select which of your <b>RHEL { osMajorVersion }</b> systems should be included
                in this policy.
            </Text>
        </TextContent>
    </React.Fragment>);

    return (
        <InventoryTable
            prependComponent={prependComponent}
            emptyStateComponent={emptyStateComponent}
            columns={columns}
            compact
            showActions={ false }
            query={ GET_SYSTEMS_WITHOUT_FAILED_RULES }
            defaultFilter={ osMajorVersion && `os_major_version = ${osMajorVersion}` }
            enableExport={ false }
            remediationsEnabled={ false }
        />
    );
};

EditPolicySystemsTab.propTypes = {
    osMajorVersion: propTypes.string,
    osMinorVersionCounts: propTypes.arrayOf(propTypes.shape({
        osMinorVersion: propTypes.number,
        count: propTypes.number
    }))
};

export default EditPolicySystemsTab;
