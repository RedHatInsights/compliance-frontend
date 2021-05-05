import React from 'react';
import propTypes from 'prop-types';
import { Tab, Badge } from '@patternfly/react-core';
import {
    selectColumns as selectRulesTableColumns
} from '@redhat-cloud-services/frontend-components-inventory-compliance/SystemRulesTable';
import { RoutedTabs } from 'PresentationalComponents';
import ProfileTabContent from './ProfileTabContent';
import OsVersionText from './OsVersionText';

const eventKey = (id) => (
    `rules-${id}`
);

const defaultTab = (tabsData, profileId) => {
    if (tabsData && tabsData.length > 0) {
        return eventKey(profileId || tabsData[0].profile.id);
    }
};

const selectedRuleRefIdsForTab = (selectedRuleRefIds, { id }) => {
    const tabSelection = (selectedRuleRefIds || []).find((selection) =>
        selection.id === id
    );
    return tabSelection?.ruleRefIds || [];
};

const TabbedRules = ({
    tabsData, defaultProfileId, selectedRuleRefIds, columns, level, handleSelect, ...rulesTableProps
}) => {
    return <RoutedTabs level={ level } defaultTab={ defaultTab(tabsData, defaultProfileId) }>
        {
            tabsData?.map(({ profile, newOsMinorVersion, systemCount }) => (
                <Tab
                    key={ eventKey(profile.id) }
                    eventKey={ eventKey(profile.id) }
                    title={
                        <span>
                            <span className='pf-u-pr-sm'>
                                <OsVersionText profile={ profile } newOsMinorVersion={newOsMinorVersion} />
                            </span>
                            <Badge isRead>{ systemCount }</Badge>
                        </span>
                    }>
                    <ProfileTabContent
                        { ...{
                            profile,
                            newOsMinorVersion,
                            columns,
                            handleSelect,
                            rulesTableProps,
                            systemCount,
                            selectedRuleRefIds: selectedRuleRefIdsForTab(selectedRuleRefIds, profile)
                        } } />
                </Tab>
            ))
        }
    </RoutedTabs>;
};

TabbedRules.propTypes = {
    tabsData: propTypes.arrayOf(
        propTypes.shape({
            profile: propTypes.object.isRequired,
            selectedRuleRefIds: propTypes.arrayOf(propTypes.string),
            newOsMinorVersion: propTypes.string,
            systemCount: propTypes.number
        })
    ).isRequired,
    selectedRuleRefIds: propTypes.arrayOf(
        propTypes.shape({
            id: propTypes.string,
            ruleRefIds: propTypes.arrayOf(propTypes.string)
        })
    ),
    columns: propTypes.arrayOf(propTypes.object),
    defaultProfileId: propTypes.string,
    handleSelect: propTypes.func,
    level: propTypes.number
};

TabbedRules.defaultProps = {
    columns: selectRulesTableColumns(['Name', 'Severity', 'Ansible']),
    level: 0
};

export default TabbedRules;
