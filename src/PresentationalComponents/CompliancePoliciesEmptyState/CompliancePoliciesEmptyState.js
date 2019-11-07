import React from 'react';
import {
    Title,
    TextContent,
    Button,
    Bullseye,
    EmptyState,
    EmptyStateIcon,
    ClipboardCopy,
    ClipboardCopyVariant
} from '@patternfly/react-core';
import emptyStateStyles from '@patternfly/patternfly/components/EmptyState/empty-state.css';
import { CloudServerIcon } from '@patternfly/react-icons';

const CompliancePoliciesEmptyState = () => (
    <Bullseye>
        <EmptyState>
            <EmptyStateIcon style={{ fontWeight: '500', color: 'var(--pf-global--primary-color--100)' }}
                size="xl" title="Compliance" icon={CloudServerIcon} />
            <br/>
            <Title size="lg">Connect with OpenSCAP to do more with Red Hat Enterprise Linux</Title>
            <br/>
            <span className={emptyStateStyles.emptyStateBody}>
                <TextContent>
                    Scan and upload a report on a system with OpenSCAP to see information
                    about your system&#39;s compliance to policies.
                    <br/>
                    Generate a report with OpenSCAP with the following command:
                    <ClipboardCopy className='upload-instructions'
                        variant={ClipboardCopyVariant.expansion}>
                        oscap xccdf eval --profile xccdf_org.ssgproject.content_profile_standard
                        --results scan.xml /usr/share/xml/scap/ssg/content/ssg-rhel7-ds.xml
                    </ClipboardCopy>
                    And upload it using the following command:
                    <ClipboardCopy className='upload-instructions'
                        variant={ClipboardCopyVariant.expansion}>
                        sudo insights-client --verbose --payload scan.xml
                        --content-type application/vnd.redhat.compliance.something+tgz
                    </ClipboardCopy>
                </TextContent>
            </span>

            <Button
                variant="primary"
                component="a"
                target="_blank"
                href="https://www.open-scap.org/getting-started/">
                Get started with OpenSCAP
            </Button>
        </EmptyState>
    </Bullseye>
);

export default CompliancePoliciesEmptyState;
