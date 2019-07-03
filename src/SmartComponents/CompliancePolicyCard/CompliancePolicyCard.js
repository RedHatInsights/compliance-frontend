import React from 'react';
import {
    Link
} from 'react-router-dom';
import Truncate from 'react-truncate';
import {
    Chip,
    Card,
    CardBody,
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
import '../../Charts.scss';

class CompliancePolicyCard extends React.Component {
    constructor(policy) {
        super(policy);
        this.policy = policy.policy;
        this.state = { cardTitle: <Truncate lines={1}>{this.policy.name}</Truncate> };
    }

    onMouseover = () => {
        this.setState({ cardTitle: this.policy.name });
    }

    onMouseout = () => {
        this.setState({ cardTitle: <Truncate lines={1}>{this.policy.name}</Truncate> });
    }

    render() {
        const compliantHostCount = this.policy.compliantHostCount;
        const totalHostCount = this.policy.totalHostCount;
        let donutValues = [
            { x: 'Compliant', y: compliantHostCount },
            { x: 'Non-compliant', y: totalHostCount - compliantHostCount }
        ];
        const compliancePercentage = Math.floor(100 *
            (donutValues[0].y / (donutValues[0].y + donutValues[1].y))) + '%';
        const label = (
            <svg
                className="chart-label"
                height={300}
                width={300}
            >
                <ChartLabel
                    style={{ fontSize: 26 }}
                    text={compliancePercentage}
                    textAnchor="middle"
                    verticalAnchor="middle"
                    x={150}
                    y={135}
                />
                <ChartLabel
                    style={{ fill: 'var(--pf-global--Color--200)' }}
                    text="Systems above threshold"
                    textAnchor="middle"
                    verticalAnchor="middle"
                    x={150}
                    y={165}
                />
            </svg>
        );

        return (
            <Card widget-id={this.policy.refId}>
                <CardBody>
                    <Text style={{ fontWeight: '500', color: 'var(--pf-global--Color--200)' }} component={TextVariants.small}>
                        External Policy
                    </Text>
                    <TextContent>
                        <Text onMouseEnter={this.onMouseover.bind(this)} onMouseLeave={this.onMouseout.bind(this)}
                            style={{ fontWeight: '500' }} component={TextVariants.h4}>
                            {this.state.cardTitle}
                        </Text>
                    </TextContent>
                    <TextContent className="chart-title">
                        <Grid>
                            <GridItem style={{ display: 'inline-flex' }} span={12}>
                                <TextContent>
                                    <span style={{ fontSize: '30px', fontWeight: '500' }}>
                                        { compliantHostCount }
                                    </span>
                                    <span style={{ fontWeight: '500', color: 'var(--pf-global--Color--200)' }}>
                                        {' '}of{' '}
                                    </span>
                                    <span style={{ fontSize: '30px', fontWeight: '500' }}>
                                        { totalHostCount }
                                    </span>
                                </TextContent>
                            </GridItem>
                            <GridItem span={8}>
                                <Text
                                    style={{ fontWeight: '500', color: 'var(--pf-global--Color--200)' }}
                                    component={TextVariants.small}
                                >
                                    Systems meet compliance threshold
                                </Text>
                            </GridItem>
                            <GridItem span={6}>
                                <TextContent>
                                    <Text component={TextVariants.small} style={{ fontSize: '16px' }} >
                                        <Link to={'/policies/' + this.policy.id} >
                                                More details
                                        </Link>
                                    </Text>
                                </TextContent>
                            </GridItem>
                            <GridItem span={6} style={{ textAlign: 'right' }}>
                                { this.policy.businessObjective &&
                                    <Chip isReadOnly>
                                        { this.policy.businessObjective.title }
                                    </Chip>
                                }
                            </GridItem>
                        </Grid>
                    </TextContent>
                </CardBody>
                <hr/>
                <CardBody>
                    <Grid>
                        <GridItem style={{ textAlign: 'center' }} span={12}>
                            <div className='chart-inline'>
                                <div className='card-chart-container'>
                                    {label}
                                    <ChartDonut data={donutValues}
                                        identifier={this.policy.name.replace(/ /g, '')}
                                        theme={ChartTheme.light.blue}
                                        height={205}
                                        width={205}
                                    />
                                </div>
                            </div>
                        </GridItem>
                    </Grid>
                </CardBody>
            </Card>
        );
    };
};

export default CompliancePolicyCard;
