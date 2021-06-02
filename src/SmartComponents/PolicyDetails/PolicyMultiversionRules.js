import React from 'react';
import propTypes from 'prop-types';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { TabbedRules } from 'PresentationalComponents';
import { mapCountOsMinorVersions } from 'Store/Reducers/SystemStore';
import { sortingByProp } from 'Utilities/helpers';
import EditRulesButtonToolbarItem from './EditRulesButtonToolbarItem';
import * as Columns from '@/PresentationalComponents/RulesTable/Columns';

const PolicyMultiversionRules = ({ policy }) => {
    const { hosts, policy: { profiles } } = policy;
    const profilesForTabs = profiles.filter((profile) => !!profile.osMinorVersion);
    const systemCounts = mapCountOsMinorVersions(hosts);

    const tabsData = profilesForTabs.sort(sortingByProp('osMinorVersion', 'desc')).map((profile) => (
        {
            profile,
            systemCount: systemCounts[profile.osMinorVersion]?.count || 0
        }
    ));

    return <React.Fragment>
        <PageSection variant={ PageSectionVariants.light }>
            <TabbedRules
                tabsData={ tabsData }
                columns={ [Columns.Name, Columns.Severity, Columns.Ansible] }
                level={ 1 }
                toolbarItems={ <EditRulesButtonToolbarItem policy={ policy } /> } />
        </PageSection>
    </React.Fragment>;
};

PolicyMultiversionRules.propTypes = {
    policy: propTypes.object.isRequired
};

export default PolicyMultiversionRules;
