import React from 'react';
import { Alert, AlertActionLink, Text, TextContent } from '@patternfly/react-core';
import { InventoryTable } from 'SmartComponents';
import { GET_SYSTEMS_WITHOUT_FAILED_RULES } from '../SystemsTable/constants';
import propTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const EmptyState = ({ osMajorVersion }) => (
    <React.Fragment>
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
    </React.Fragment>
);

EmptyState.propTypes = {
    osMajorVersion: propTypes.string
};

const PrependComponent = ({ osMajorVersion }) => (
    <React.Fragment>
        <TextContent className="pf-u-mb-md">
            <Text>
                Select which of your <b>RHEL { osMajorVersion }</b> systems should be included
                in this policy.
            </Text>
        </TextContent>
    </React.Fragment>
);

PrependComponent.propTypes = {
    osMajorVersion: propTypes.string
};

const EditPolicySystemsTab = ({ osMajorVersion, newRuleTabs }) => {
    const { push, location } = useHistory();

    const columns = [{
        key: 'display_name',
        title: 'Name',
        props: {
            width: 40, isStatic: true
        },
        renderFunc: (displayName, _id, { name }) => (displayName || name)
    }, {
        key: 'osMinorVersion',
        title: 'Operating system',
        props: {
            width: 40, isStatic: true
        },
        renderFunc: (osMinorVersion, _id, { osMajorVersion }) => `RHEL ${osMajorVersion}.${osMinorVersion}`
    }];

    return (
        <React.Fragment>
            <InventoryTable
                showOsMinorVersionFilter={ [osMajorVersion] }
                prependComponent={ <PrependComponent osMajorVersion={ osMajorVersion } />  }
                emptyStateComponent={ <EmptyState osMajorVersion={ osMajorVersion } />  }
                columns={ columns }
                compact
                showActions={ false }
                query={ GET_SYSTEMS_WITHOUT_FAILED_RULES }
                defaultFilter={ osMajorVersion && `os_major_version = ${osMajorVersion}` }
                enableExport={ false }
                remediationsEnabled={ false }
            />
            {newRuleTabs && <Alert
                variant="info"
                isInline
                title="You selected a system that has a release version previously not included in this policy."
                actionLinks={
                    <AlertActionLink onClick={ () => push({ ...location, hash: '#rules' }) }>Open rule editing</AlertActionLink>
                }>
                <p>If you have edited any rules for this policy, you will need to do so for this release version as well.</p>
            </Alert>}
        </React.Fragment>
    );
};

EditPolicySystemsTab.propTypes = {
    osMajorVersion: propTypes.string,
    newRuleTabs: propTypes.bool
};

export default EditPolicySystemsTab;
