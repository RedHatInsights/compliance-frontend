import React from 'react';
import propTypes from 'prop-types';
import { Alert, Label, TabTitleText, PageSection, PageSectionVariants } from '@patternfly/react-core';
import {
    selectColumns as selectRulesTableColumns
} from '@redhat-cloud-services/frontend-components-inventory-compliance/SystemRulesTable';
import { TabbedRules } from 'PresentationalComponents';

const SSGTabTitle = ({ profile: { ssgVersion, rules = [] } }) => (
    <TabTitleText>
        <span>SSG { ssgVersion + ' ' }</span>
        <Label color="blue">{ rules.length }</Label>
    </TabTitleText>
);

SSGTabTitle.propTypes = {
    profile: propTypes.object.isRequired
};

const PolicyMultiversionRules = ({ policy: { hosts, policy: { profiles } } }) => {
    let tabsData = profiles.filter(
        (profile) => profile.osMinorVersion !== ''
    ).map((profile) => ({
        profile,
        systemCount: hosts.filter(
            (host) => `${host.osMinorVersion}` === profile.osMinorVersion
        ).length
    }));

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
