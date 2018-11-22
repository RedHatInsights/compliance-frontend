import React from 'react';
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
import {
    ChartDonut,
    ChartLabel,
    ChartTheme
} from '@patternfly/react-charts';

class CompliancePolicyCard extends React.Component {
    constructor(policy) {
        super();
        this.policy = policy.policy;
    }

    getChart(theme) {
        const compliantHostCount = this.policy.attributes.compliant_host_count;
        const totalHostCount = this.policy.attributes.total_host_count;
        return (
            <ChartDonut
                data={[
                    { x: 'Compliant', y: compliantHostCount },
                    { x: 'Non-compliant', y: totalHostCount - compliantHostCount }
                ]}
                labels={this.getTooltipLabel}
                theme={theme}
                height={210}
                width={210}
            />
        );
    };

    getTooltipLabel(datum) {
        return `${datum.x}: ${datum.y}`;
    };

    render() {
        const compliantHostCount = this.policy.attributes.compliant_host_count;
        const totalHostCount = this.policy.attributes.total_host_count;
        const compliancePercentage = 100 * compliantHostCount / totalHostCount;
        const label = (
            <svg
                className="chart-label"
                style={{ position: 'absolute' }}
                height={210}
                width={210}
            >
                <ChartLabel
                    style={{ fontSize: 20 }}
                    text={compliancePercentage + '%'}
                    textAnchor="middle"
                    verticalAnchor="middle"
                    x={160}
                    y={150}
                />
                <ChartLabel
                    style={{ fill: '#bbb', fontSize: 15 }}
                    text="Compliant"
                    textAnchor="middle"
                    verticalAnchor="middle"
                    x={160}
                    y={170}
                />
            </svg>
        );

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
                    <div className="chart-container">
                        {label}
                        {this.getChart(ChartTheme.light.green)}
                    </div>
                </CardBody>
                <CardFooter>
                    <TextContent>
                        <Text component={TextVariants.small}>
                            <Text component={TextVariants.a} href="#">
                                View details
                            </Text>
                        </Text>
                    </TextContent>
                </CardFooter>
            </Card>
        );
    };
};

export default CompliancePolicyCard;
