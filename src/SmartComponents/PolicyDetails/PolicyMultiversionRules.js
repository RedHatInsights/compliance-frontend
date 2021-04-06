import React from 'react';
import propTypes from 'prop-types';
import { Alert, PageSection, PageSectionVariants } from '@patternfly/react-core';
import {
    selectColumns as selectRulesTableColumns
} from '@redhat-cloud-services/frontend-components-inventory-compliance/SystemRulesTable';
import { TabbedRules } from 'PresentationalComponents';
import { mapCountOsMinorVersions } from 'Store/Reducers/SystemStore';
import { sortingByProp } from 'Utilities/helpers';

const PolicyMultiversionRules = ({ policy }) => {
    const { hosts, policy: { profiles } } = policy;
    const profilesForTabs = profiles.filter((profile) => !!profile.osMinorVersion);
    const systemCounts = mapCountOsMinorVersions(hosts);

    const tabsData = profilesForTabs.sort(sortingByProp('osMinorVersion')).map((profile) => (
        {
            profile,
            systemCount: systemCounts[profile.osMinorVersion]?.count || 0
        }
    ));

    return <React.Fragment>
        <Alert variant="info" isInline title="Rule editing coming soon" />
        <PageSection variant={ PageSectionVariants.light }>
            <TabbedRules
                tabsData={ tabsData }
                columns={ selectRulesTableColumns(['Name', 'Severity', 'Ansible']) }
                level={ 1 } />
        </PageSection>
    </React.Fragment>;
};

PolicyMultiversionRules.propTypes = {
    policy: propTypes.object.isRequired
};

export default PolicyMultiversionRules;
