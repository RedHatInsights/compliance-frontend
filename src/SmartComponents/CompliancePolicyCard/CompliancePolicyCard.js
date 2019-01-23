import React from 'react';
import {
    Link
} from 'react-router-dom';
import {
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
        super();
        this.policy = policy.policy;
    }

    render() {
        const compliantHostCount = this.policy.compliant_host_count;
        const totalHostCount = this.policy.total_host_count;
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
                    style={{ fill: '#bbb' }}
                    text="Compliant"
                    textAnchor="middle"
                    verticalAnchor="middle"
                    x={150}
                    y={165}
                />
            </svg>
        );

        return (
            <Card>
                <CardBody>
                    <Text style={{ fontWeight: '500', color: '#bbb' }} component={TextVariants.small}>External Policy</Text>
                    <TextContent>
                        <Text style={{ fontWeight: '500' }} component={TextVariants.h4}>{this.policy.name}</Text>
                    </TextContent>
                    <TextContent className="chart-title">
                        <Grid>
                            <GridItem style={{ display: 'inline-flex' }} span={12}>
                                <TextContent>
                                    <span style={{ fontSize: '30px', fontWeight: '500' }}>
                                        { compliantHostCount }
                                    </span>
                                    <span style={{ fontWeight: '500', color: '#bbb' }}>
                                        {' '}of{' '}
                                    </span>
                                    <span style={{ fontSize: '30px', fontWeight: '500' }}>
                                        { totalHostCount }
                                    </span>
                                </TextContent>
                            </GridItem>
                            <GridItem span={8}>
                                <Text style={{ fontWeight: '500', color: '#bbb' }} component={TextVariants.small}>
                                    Systems Compliant
                                </Text>
                            </GridItem>
                        </Grid>
                    </TextContent>
                    <hr/>
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
                    <TextContent style={{ textAlign: 'right' }}>
                        <Text component={TextVariants.small}>
                            <Link to={'/policies/' + this.policy.id} >
                                More Details
                            </Link>
                        </Text>
                    </TextContent>
                </CardBody>
            </Card>
        );
    };
};

export default CompliancePolicyCard;
