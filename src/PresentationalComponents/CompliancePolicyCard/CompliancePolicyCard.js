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
    ChartThemeColor,
    ChartThemeVariant
} from '@patternfly/react-charts';
import '../../Charts.scss';
import { fixedPercentage } from '../../Utilities/TextHelper';

// TODO: Turn into functional component
// TODO: Use hooks for state changing
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
        // TODO: These donut charts are in a few places with similar calculations possibly extract this into a component
        const compliantHostCount = this.policy.compliantHostCount;
        const totalHostCount = this.policy.totalHostCount;
        let donutValues = [
            { x: 'Compliant', y: compliantHostCount },
            { x: 'Non-compliant', y: totalHostCount - compliantHostCount }
        ];
        const compliancePercentage = fixedPercentage(Math.floor(100 *
            (donutValues[0].y / (donutValues[0].y + donutValues[1].y))));

        return (
            <Card widget-id={this.policy.refId}>
                <CardBody>
                    <Text style={{ fontWeight: '500', color: 'var(--pf-global--Color--200)' }} component={TextVariants.small}>
                        External policy
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
                            <GridItem span={12}>
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
                                    <ChartDonut data={donutValues}
                                        identifier={this.policy.name.replace(/ /g, '')}
                                        innerRadius={122}
                                        themeColor={ChartThemeColor.blue}
                                        themeVariant={ChartThemeVariant.light}
                                        title={compliancePercentage}
                                        subTitle="Systems above threshold"
                                        height={300}
                                        width={300}
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
