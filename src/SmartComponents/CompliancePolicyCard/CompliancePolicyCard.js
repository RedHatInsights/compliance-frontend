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
import { Donut } from '@red-hat-insights/insights-frontend-components';

class CompliancePolicyCard extends React.Component {
    constructor(policy) {
        super();
        this.policy = policy.policy;
    }

    render() {
        const compliantHostCount = this.policy.compliant_host_count;
        const totalHostCount = this.policy.total_host_count;
        let donutValues = [
            ['Compliant', compliantHostCount],
            ['Non-compliant', totalHostCount - compliantHostCount]
        ];

        return (
            <Card>
                <CardHeader>
                    <TextContent>
                        <Text component={TextVariants.small}>External Policy</Text>
                        <Text component={TextVariants.h2}>{this.policy.name}</Text>
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
                            <Donut values={donutValues}
                                identifier={this.policy.name.replace(/ /g, '')}
                            />
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
