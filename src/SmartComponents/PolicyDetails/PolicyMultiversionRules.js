import React from 'react';
import propTypes from 'prop-types';
import { Alert, Label, TabTitleText, PageSection, PageSectionVariants } from '@patternfly/react-core';
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

const mapProfileToTabs = (profiles) => (
    profiles.map((profile) => (
        {
            profile,
            title: <SSGTabTitle profile={ profile } />,
            rules: profile.rules
        }
    ))
);

const PolicyMultiversionRules = ({ policy: { policy: { profiles } } }) => (
    <React.Fragment>
        <Alert variant="info" isInline title="Rule editing coming soon" />
        <PageSection variant={ PageSectionVariants.light }>
            <TabbedRules
                tabsData={ mapProfileToTabs(profiles) }
                columns={ ['Name', 'Severity', 'Ansible'] }
                level={ 1 } />
        </PageSection>
    </React.Fragment>
);

PolicyMultiversionRules.propTypes = {
    policy: propTypes.object.isRequired
};

export default PolicyMultiversionRules;
