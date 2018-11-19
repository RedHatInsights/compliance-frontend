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
        return (
            <ChartDonut
                data={[
                    { x: 'Cats', y: 35 },
                    { x: 'Dogs', y: 55 },
                    { x: 'Birds', y: 10 }
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
        const label = (
            <svg
                className="chart-label"
                style={{ position: 'absolute' }}
                height={210}
                width={210}
            >
                <ChartLabel
                    style={{ fontSize: 20 }}
                    text="75%"
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
                        <Text style={{ lineHeight: '0px' }} component={TextVariants.small}>External Policy</Text>
                        <Text style={{ lineHeight: '0px' }} component={TextVariants.h2}>{this.policy.attributes.name}</Text>
                    </TextContent>
                </CardHeader>
                <CardBody>
                    <TextContent className="chart-title">
                        <Grid>
                            <GridItem style={{ fontWeight: '800' }} span={4} rowSpan={2}>
                                <Text component={TextVariants.h1}>
                                    384
                                </Text>
                            </GridItem>
                            <GridItem span={8}>
                                <Text style={{ lineHeight: '0px', fontWeight: '200' }}
                                    className="chart-title" component={TextVariants.h6}>
                                    Compliant
                                </Text>
                            </GridItem>
                            <GridItem span={8}>
                                <Text style={{ lineHeight: '0px', fontWeight: '200' }}
                                    className="chart-title" component={TextVariants.h6}>
                                    of 512
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
