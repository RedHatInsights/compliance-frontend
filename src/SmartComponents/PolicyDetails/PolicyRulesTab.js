import React from 'react';
import propTypes from 'prop-types';
import { Alert, Text, TextVariants, PageSection, PageSectionVariants } from '@patternfly/react-core';
import SystemRulesTable, {
    selectColumns as selectRulesTableColumns
} from '@redhat-cloud-services/frontend-components-inventory-compliance/SystemRulesTable';
import EditRulesButtonToolbarItem from './EditRulesButtonToolbarItem';

const PolicyRulesTab = ({ loading, policy }) => (
    <React.Fragment>
        <Alert isInline variant='info' title='Rule editing is now available.'>
            SCAP policies created before April 19th, 2021 with rule editing will use the full default
            set of rules for the policy with the most accurate benchmark for systems within the policy.
            Click the &quot;Edit rules&quot; or &quot;Edit policy&quot; button to edit rules.
        </Alert>
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
            columns={ selectRulesTableColumns(['Name', 'Severity', 'Ansible']) }
            loading={ loading }
            profileRules={[{
                profile: { refId: policy.refId, name: policy.name },
                rules: policy.rules
            }]}
            toolbarItems={ <EditRulesButtonToolbarItem policy={ policy } /> }
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
