import React from 'react';
import propTypes from 'prop-types';
import { PageSection, PageSectionVariants, ToolbarItem, Button } from '@patternfly/react-core';
import {
    selectColumns as selectRulesTableColumns
} from '@redhat-cloud-services/frontend-components-inventory-compliance/SystemRulesTable';
import { useAnchor } from 'Utilities/Router';
import { TabbedRules, BackgroundLink } from 'PresentationalComponents';
import { mapCountOsMinorVersions } from 'Store/Reducers/SystemStore';
import { sortingByProp } from 'Utilities/helpers';

const EditRulesButtonToolbarItem = ({ policy }) => {
    let anchor = useAnchor();

    return (
        <ToolbarItem>
            <BackgroundLink
                to={ `/scappolicies/${ policy.id }/edit` }
                state={ { policy } }
                hash={ anchor }
                backgroundLocation={ { hash: anchor } }>
                <Button variant='primary'>Edit rules</Button>
            </BackgroundLink>
        </ToolbarItem>
    );
};

EditRulesButtonToolbarItem.propTypes = {
    policy: propTypes.object.isRequired
};

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
                columns={ selectRulesTableColumns(['Name', 'Severity', 'Ansible']) }
                level={ 1 }
                toolbarItems={ <EditRulesButtonToolbarItem policy={ policy } /> } />
        </PageSection>
    </React.Fragment>;
};

PolicyMultiversionRules.propTypes = {
    policy: propTypes.object.isRequired
};

export default PolicyMultiversionRules;
