import React from 'react';
import propTypes from 'prop-types';
import { Tab } from '@patternfly/react-core';
import {
    selectColumns as selectRulesTableColumns
} from '@redhat-cloud-services/frontend-components-inventory-compliance/SystemRulesTable';
import { RoutedTabs } from 'PresentationalComponents';
import { sortingByProp } from 'Utilities/helpers';
import ProfileTabContent from './ProfileTabContent';
import OsVersionText from './OsVersionText';

const eventKey = (id) => (
    `rules-${id}`
);

const defaultTab = (profiles, profileId) => {
    if (profiles && profiles.length > 0) {
        return eventKey(profileId || profiles[0].id);
    }
};

const TabbedRules = ({
    profiles, systemsCounts, defaultProfileId, columns, level, handleSelect, selectedRuleRefIds, ...rulesTableProps
}) => {
    const sortableProfile = profiles?.map((profile) => ({
        ...profile,
        sortableMinorVersion: (profile.osMinorVersion || profile?.benchmark?.latestSupportedOsMinorVersions[0])
    }));
    const sortedProfiles = (sortableProfile || []).sort(sortingByProp('sortableMinorVersion', 'desc'));

    return <RoutedTabs level={ level } defaultTab={ defaultTab(sortedProfiles, defaultProfileId) }>
        {
            sortedProfiles?.map((profile) => (
                <Tab
                    key={ eventKey(profile.id) }
                    eventKey={ eventKey(profile.id) }
                    title={
                        <OsVersionText profile={ profile } />
                    }>
                    <ProfileTabContent
                        { ...{
                            profile,
                            columns,
                            handleSelect,
                            rulesTableProps,
                            systemsCounts,
                            selectedRuleRefIds: (selectedRuleRefIds?.find((selectedProfile) => (
                                selectedProfile.id === profile.id
                            ))?.selectedRuleRefIds || [])
                        } } />
                </Tab>
            ))
        }
    </RoutedTabs>;
};

TabbedRules.propTypes = {
    columns: propTypes.arrayOf(propTypes.string),
    defaultProfileId: propTypes.string,
    handleSelect: propTypes.func,
    level: propTypes.number,
    profiles: propTypes.array,
    systemsCounts: propTypes.object,
    selectedRuleRefIds: propTypes.object
};

TabbedRules.defaultProps = {
    columns: selectRulesTableColumns(['Name', 'Severity', 'Ansible']),
    level: 0
};

export default TabbedRules;
