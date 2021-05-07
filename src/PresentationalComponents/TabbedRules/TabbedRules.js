import React from 'react';
import propTypes from 'prop-types';
import { Tab, Badge } from '@patternfly/react-core';
import {
    selectColumns as selectRulesTableColumns
} from '@redhat-cloud-services/frontend-components-inventory-compliance/SystemRulesTable';
import { RoutedTabs } from 'PresentationalComponents';
import ProfileTabContent from './ProfileTabContent';
import OsVersionText from './OsVersionText';
import { selectedRuleRefIdsForTab } from './ruleSelection';

const eventKey = ({ id, osMinorVersion }, newOsMinorVersion) => (
    `rules-${id}-${osMinorVersion || newOsMinorVersion}`
);

const getDefaultTab = (tabsData, defaultTab) => {
    if (!tabsData || tabsData.length === 0) {
        return;
    }

    if (!defaultTab) {
        const firstTab = tabsData[0];
        defaultTab = {
            id: firstTab.profile.id,
            osMinorVersion: firstTab.profile.osMinorVersion || firstTab.newOsMinorVersion
        };
    }

    return eventKey(defaultTab);
};

const TabbedRules = ({
    tabsData, defaultTab, selectedRuleRefIds, setSelectedRuleRefIds, columns, level, ...rulesTableProps
}) => {
    const handleSelect = (profile, profileSelectedRuleRefIds) => {
        const filteredSelection = (selectedRuleRefIds || []).filter((profileSelection) =>
            profileSelection.id !== profile.id
        );
        const newSelection = [
            { id: profile.id, ruleRefIds: profileSelectedRuleRefIds },
            ...filteredSelection
        ];
        setSelectedRuleRefIds(newSelection);
    };

    return <RoutedTabs level={ level } defaultTab={ getDefaultTab(tabsData, defaultTab) }>
        {
            tabsData?.map(({ profile, newOsMinorVersion, systemCount }) => (
                <Tab
                    key={ eventKey(profile, newOsMinorVersion) }
                    eventKey={ eventKey(profile, newOsMinorVersion) }
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
                            rulesTableProps,
                            systemCount,
                            selectedRuleRefIds: selectedRuleRefIdsForTab(selectedRuleRefIds, profile),
                            handleSelect: setSelectedRuleRefIds ? handleSelect : undefined
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
    setSelectedRuleRefIds: propTypes.func,
    columns: propTypes.arrayOf(propTypes.object),
    defaultTab: propTypes.shape({
        id: propTypes.string,
        osMinorVersion: propTypes.string
    }),
    level: propTypes.number
};

TabbedRules.defaultProps = {
    columns: selectRulesTableColumns(['Name', 'Severity', 'Ansible']),
    level: 0
};

export default TabbedRules;
