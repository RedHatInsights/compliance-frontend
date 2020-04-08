import React from 'react';
import propTypes from 'prop-types';
import { Alert } from '@patternfly/react-core';
import { SystemRulesTable, ANSIBLE_ICON } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { sortable } from '@patternfly/react-table';

const PolicyRulesTab = ({ loading, policy }) => (<React.Fragment>
    <Alert variant="info" isInline title="Rule editing coming soon" />
    <SystemRulesTable
        remediationsEnabled={false}
        columns={[
            { title: 'Rule', transforms: [sortable] },
            { title: 'Severity', transforms: [sortable] },
            { title: <React.Fragment>{ ANSIBLE_ICON } Ansible</React.Fragment>, transforms: [sortable], original: 'Ansible' }
        ]}
        loading={ loading }
        profileRules={[{
            profile: { refId: policy.refId, name: policy.name },
            rules: policy.rules
        }]}
    />
</React.Fragment>);

PolicyRulesTab.propTypes = {
    loading: propTypes.bool,
    policy: propTypes.shape({
        name: propTypes.string,
        refId: propTypes.string,
        rules: propTypes.array
    })
};

export default PolicyRulesTab;
