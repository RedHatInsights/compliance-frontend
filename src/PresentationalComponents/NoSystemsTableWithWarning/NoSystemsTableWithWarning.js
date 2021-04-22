import React from 'react';
import {
    EmptyStateBody, EmptyState, EmptyStateVariant, Text, TextContent, TextVariants, Title, Bullseye
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { WARNING_TEXT } from 'PresentationalComponents';

const NoSystemsTableWithWarning = () => (
    <Bullseye>
        <EmptyState variant={ EmptyStateVariant.full }>
            <Title headingLevel="h2" size='lg' style={ { fontWeight: 'bold' }}>
                No systems on this policy
            </Title>
            <EmptyStateBody>
                <TextContent>
                    <Text component={ TextVariants.p }>
                        Add systems to this policy from the systems page
                    </Text>
                    <Text style={ { color: 'var(--pf-global--warning-color--100)' }}>
                        <ExclamationTriangleIcon /> { WARNING_TEXT }
                    </Text>
                </TextContent>
            </EmptyStateBody>
        </EmptyState>
    </Bullseye>
);

export default NoSystemsTableWithWarning;
