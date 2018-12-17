import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import {
    Card,
    CardHeader,
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
            result = <div style={{ color: '#92d400' }} id='policy_compliant'>
                <CheckCircleIcon /> Compliant
            </div>;
        } else {
            result = <div style={{ color: '#a30000' }} id='policy_compliant'>
                <ExclamationCircleIcon/> Noncompliant
            </div>;
        }

        return result;
    }

    render() {
        const totalRules = this.policy.rules_passed + this.policy.rules_failed;
        return (
            <Card>
                <CardHeader>
                    <TextContent>
                        <Text component={TextVariants.small}>External Policy</Text>
                        <Text component={TextVariants.medium}>{this.policy.name}</Text>
                    </TextContent>
                </CardHeader>
                <CardBody>
                    { this.complianceIcon(this.policy.compliant) }
                    <TextContent className="chart-title">
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
