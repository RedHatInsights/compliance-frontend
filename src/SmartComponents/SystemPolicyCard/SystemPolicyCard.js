import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import {
    Card,
    CardBody,
    CardFooter,
    Text,
    TextContent,
    TextVariants
} from '@patternfly/react-core';

class SystemPolicyCard extends React.Component {
    constructor(policy) {
        super();
        this.policy = policy.policy;
    }

    complianceIcon(compliant) {
        let result;
        if (compliant) {
            result = <div style={{ fontSize: 'large', color: '#92d400' }} id='policy_compliant'>
                <CheckCircleIcon /> Compliant
            </div>;
        } else {
            result = <div style={{ fontSize: 'large', color: '#a30000' }} id='policy_compliant'>
                <ExclamationCircleIcon/> Noncompliant
            </div>;
        }

        return result;
    }

    render() {
        const totalRules = this.policy.rules_passed + this.policy.rules_failed;
        return (
            <Card>
                <CardBody>
                    <TextContent>
                        <Text style={{ marginBottom: '0px' }} component={TextVariants.small}>External Policy</Text>
                        <Text style={{ marginTop: '0px' }} component={TextVariants.h4}>{this.policy.name}</Text>
                    </TextContent>
                    <TextContent>
                        { this.complianceIcon(this.policy.compliant) }
                        <Text component={TextVariants.small}>
                            { this.policy.rules_passed } of { totalRules } passed
                        </Text>
                        <Text component={TextVariants.medium}>
                            Profile <br/>
                            { this.policy.ref_id }
                        </Text>
                    </TextContent>
                </CardBody>
                <CardFooter>
                    <TextContent>
                        <Text component={TextVariants.small}>
                          Last scanned: { this.policy.last_scanned }
                        </Text>
                    </TextContent>
                </CardFooter>
            </Card>
        );
    };
};

export default SystemPolicyCard;
