import React from 'react';
import propTypes from 'prop-types';
import { Alert, Label, Tab, TabTitleText, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { SystemRulesTable, selectRulesTableColumns } from '@redhat-cloud-services/frontend-components-inventory-compliance/esm';
import { RoutedTabs } from 'PresentationalComponents';

const PolicyMultiversionRules = ({ policy: { policy: { profiles } } }) => (
    <React.Fragment>
        <Alert variant="info" isInline title="Rule editing coming soon" />
        <PageSection variant={ PageSectionVariants.light }>
            <RoutedTabs level={ 1 } defaultTab={ profiles[0].ssgVersion }>
                {
                    profiles.map((profile) => (
                        <Tab
                            key={ `ssgversion-tab-${ profile.ssgVersion }` }
                            title={
                                <TabTitleText>
                                    <span>SSG { profile.ssgVersion + ' ' }</span>
                                    <Label color="blue">{ profile.rules.length }</Label>
                                </TabTitleText>
                            }
                            eventKey={ profile.ssgVersion }>
                            <SystemRulesTable
                                remediationsEnabled={false}
                                columns={ selectRulesTableColumns(['Rule', 'Severity', 'Ansible']) }
                                profileRules={[{
                                    profile: { ...profile },
                                    rules: profile.rules
                                }]} />
                        </Tab>
                    ))
                }
            </RoutedTabs>
        </PageSection>
    </React.Fragment>
);

PolicyMultiversionRules.propTypes = {
    policy: propTypes.object.isRequired
};

export default PolicyMultiversionRules;
