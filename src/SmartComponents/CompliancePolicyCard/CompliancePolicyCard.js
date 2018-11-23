import React from 'react';
import {
    Link
} from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Text,
    TextContent,
    TextVariants,
    Grid,
    GridItem
} from '@patternfly/react-core';
import CompliancePolicyDonut from '../CompliancePolicyDonut/CompliancePolicyDonut.js';

class CompliancePolicyCard extends React.Component {
    constructor(policy) {
        super();
        this.policy = policy.policy;
    }

    render() {
        const compliantHostCount = this.policy.attributes.compliant_host_count;
        const totalHostCount = this.policy.attributes.total_host_count;

        return (
            <Card>
                <CardHeader>
                    <TextContent>
                        <Text component={TextVariants.small}>External Policy</Text>
                        <Text component={TextVariants.h2}>{this.policy.attributes.name}</Text>
                    </TextContent>
                </CardHeader>
                <CardBody>
                    <TextContent className="chart-title">
                        <Grid>
                            <GridItem style={{ fontWeight: '800' }} span={4} rowSpan={2}>
                                <Text component={TextVariants.h1}>
                                    { compliantHostCount }
                                </Text>
                            </GridItem>
                            <GridItem span={8}>
                                <Text style={{ fontWeight: '200' }}
                                    className="chart-title" component={TextVariants.h6}>
                                    Compliant
                                </Text>
                            </GridItem>
                            <GridItem span={8}>
                                <Text style={{ fontWeight: '200' }}
                                    className="chart-title" component={TextVariants.h6}>
                                    of { totalHostCount }
                                </Text>
                            </GridItem>
                        </Grid>
                    </TextContent>
                    <hr/>
                    <Grid>
                        <GridItem span={12}>
                            <CompliancePolicyDonut policy={this.policy} height={320} width={320} />
                        </GridItem>
                    </Grid>
                </CardBody>
                <CardFooter>
                    <TextContent>
                        <Text component={TextVariants.small}>
                            <Link to={'/policies/' + this.policy.id} >
                                View details
                            </Link>
                        </Text>
                    </TextContent>
                </CardFooter>
            </Card>
        );
    };
};

export default CompliancePolicyCard;
