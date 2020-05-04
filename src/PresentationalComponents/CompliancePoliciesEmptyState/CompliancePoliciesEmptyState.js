import React from 'react';
import propTypes from 'prop-types';
import {
    Title,
    TextContent,
    Button,
    Bullseye,
    EmptyState,
    EmptyStateBody,
    EmptyStateSecondaryActions,
    EmptyStateIcon
} from '@patternfly/react-core';
import { CloudServerIcon } from '@patternfly/react-icons';
import { CreatePolicy } from 'SmartComponents';

const CompliancePoliciesEmptyState = ({ title }) => (
    <Bullseye>
        <EmptyState>
            <EmptyStateIcon style={{ fontWeight: '500', color: 'var(--pf-global--primary-color--100)' }}
                size="xl" title="Compliance" icon={CloudServerIcon} />
            <br/>
            <Title size="lg">{ title }</Title>
            <br/>
            <EmptyStateBody>
                <TextContent>
                    The Compliance service uses SCAP policies to track your organization&#39;s adherence to
                    compliance requirements.
                </TextContent>
                <TextContent>
                    Get started by adding a policy, or read documentation about how to connect OpenSCAP to the
                    Compliance service.
                </TextContent>
            </EmptyStateBody>
            <CreatePolicy onWizardFinish={() => { location.reload(); }} />
            <EmptyStateSecondaryActions>
                <Button variant='link' component='a' target='_blank' rel='noopener noreferrer'
                    href='https://www.open-scap.org/getting-started/' >
                    Learn about OpenSCAP and Compliance
                </Button>
            </EmptyStateSecondaryActions>
        </EmptyState>
    </Bullseye>
);

CompliancePoliciesEmptyState.propTypes = {
    title: propTypes.string
};

CompliancePoliciesEmptyState.defaultProps = {
    title: 'No policies'
};

export default CompliancePoliciesEmptyState;
