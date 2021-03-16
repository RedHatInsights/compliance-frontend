import React from 'react';
import propTypes from 'prop-types';
import { Tab } from '@patternfly/react-core';
import RulesTable, {
    selectColumns as selectRulesTableColumns
} from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { RoutedTabs } from 'PresentationalComponents';

const eventKey = (id) => (
    `rules-${id}`
);

const defaultTab = (tabsData, profileId) => {
    if (tabsData && tabsData.length > 0) {
        return eventKey(profileId || tabsData[0].profile.id);
    }
};

const TabbedRules = ({ tabsData, defaultProfileId, columns, level, handleSelect, ...rulesTableProps }) => (
    <RoutedTabs level={ level } defaultTab={ defaultTab(tabsData, defaultProfileId) }>
        {
            tabsData?.map(({ title, profile, rules }) => (
                <Tab
                    title={ title }
                    key={ eventKey(profile.id) }
                    eventKey={ eventKey(profile.id) }>
                    <RulesTable
                        remediationsEnabled={false}
                        columns={ selectRulesTableColumns(columns) }
                        profileRules={ [{ profile, rules }] }
                        handleSelect={
                            handleSelect
                            && ((selectedRuleRefIds) => handleSelect(profile, selectedRuleRefIds))
                        }
                        { ...rulesTableProps } />
                </Tab>
            ))
        }
    </RoutedTabs>
);

TabbedRules.propTypes = {
    tabsData: propTypes.arrayOf(
        propTypes.shape(
            {
                title: propTypes.oneOfType([propTypes.string, propTypes.node]).isRequired,
                profile: propTypes.object.isRequired,
                rules: propTypes.arrayOf(propTypes.object).isRequired
            }
        )
    ).isRequired,
    defaultProfileId: propTypes.string,
    columns: propTypes.arrayOf(propTypes.string),
    level: propTypes.number,
    handleSelect: propTypes.func
};

TabbedRules.defaultProps = {
    columns: ['Name', 'Severity', 'Ansible'],
    level: 0
};

export default TabbedRules;
