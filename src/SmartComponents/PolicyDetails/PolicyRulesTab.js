import React from 'react';
import propTypes from 'prop-types';
import { Alert, Text, TextVariants, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { SystemRulesTable, selectRulesTableColumns } from '@redhat-cloud-services/frontend-components-inventory-compliance';

const PolicyRulesTab = ({ loading, policy }) => (
    <React.Fragment>
        <Alert variant="info" isInline title="Rule editing coming soon" />
        <PageSection variant={PageSectionVariants.light}>
            <Text component={TextVariants.p}>
                <strong>What rules are shown on this list?&nbsp;</strong>
                This view shows rules that are from the latest SSG version ({ policy.benchmark.version }).
                If you are using a different version of SSG for systems in this policy,
                those rules will be different and can be viewed on the systems details page.
            </Text>
        </PageSection>
        <SystemRulesTable
            remediationsEnabled={false}
            columns={ selectRulesTableColumns(['Rule', 'Severity', 'Ansible']) }
            loading={ loading }
            profileRules={[{
                profile: { refId: policy.refId, name: policy.name },
                rules: policy.rules
            }]}
        />
    </React.Fragment>
);

PolicyRulesTab.propTypes = {
    loading: propTypes.bool,
    policy: propTypes.shape({
        name: propTypes.string,
        refId: propTypes.string,
        rules: propTypes.array,
        benchmark: propTypes.object
    })
};

export default PolicyRulesTab;
