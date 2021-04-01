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

const TabbedRules = ({
    tabsData, defaultProfileId, columns, level, handleSelect, ...rulesTableProps
}) => {
    return <RoutedTabs level={ level } defaultTab={ defaultTab(tabsData, defaultProfileId) }>
        {
            tabsData?.map(({ profile, selectedRuleRefIds, newOsMinorVersion, systemCount }) => (
                <Tab
                    key={ eventKey(profile.id) }
                    eventKey={ eventKey(profile.id) }
                    title={
                        <span>
                            <OsVersionText profile={ profile } newOsMinorVersion={newOsMinorVersion} />
                            {' '}
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
                            selectedRuleRefIds: (selectedRuleRefIds || [])
                        } } />
                </Tab>
            ))
        }
    </RoutedTabs>;
};

TabbedRules.propTypes = {
    tabsData: propTypes.arrayOf(
        propTypes.shape(
            {
                profile: propTypes.object.isRequired,
                selectedRuleRefIds: propTypes.arrayOf(propTypes.string),
                newOsMinorVersion: propTypes.string,
                systemCount: propTypes.number
            }
        )
    ).isRequired,
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
