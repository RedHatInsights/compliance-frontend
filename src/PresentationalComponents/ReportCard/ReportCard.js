import React from 'react';
import propTypes from 'prop-types';
import {
    Link
} from 'react-router-dom';
import Truncate from 'react-truncate';
import {
    Card,
    CardHeader,
    CardFooter,
    CardBody,
    Text,
    TextContent,
    TextVariants,
    Tooltip,
    Grid,
    GridItem
} from '@patternfly/react-core';
import PolicyPopover from './PolicyPopover';
import {
    ChartDonut,
    ChartThemeColor,
    ChartThemeVariant
} from '@patternfly/react-charts';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import '../../Charts.scss';
import { fixedPercentage } from '../../Utilities/TextHelper';

class ReportCard extends React.Component {
    policy = this.props.policy;
    state = {
        cardTitleTruncated: true
    }

    onMouseover = () => {
        this.setState({
            cardTitleTruncated: false
        });
    }

    onMouseout = () => {
        this.setState({
            cardTitleTruncated: true
        });
    }

    render() {
        const { cardTitleTruncated } = this.state;
        const {
            benchmark, external, majorOsVersion, compliantHostCount, totalHostCount, refId, name, id
        } = this.policy;
        let donutValues = [
            { x: 'Compliant', y: compliantHostCount },
            { x: 'Non-compliant', y: totalHostCount - compliantHostCount }
        ];
        const compliancePercentage = fixedPercentage(Math.floor(100 *
            (donutValues[0].y / (donutValues[0].y + donutValues[1].y))));

        return (
            <Card widget-id={refId}>
                <CardHeader>
                    <TextContent>
                        <Text onMouseEnter={this.onMouseover.bind(this)} onMouseLeave={this.onMouseout.bind(this)}
                            style={{ fontWeight: '500' }} component={TextVariants.h2}>
                            { cardTitleTruncated ? <Truncate lines={1}>{name}&nbsp;
                                { !external && <PolicyPopover policy={this.policy} />}</Truncate> :
                                <React.Fragment>{name}&nbsp;
                                    { !external && <PolicyPopover policy={this.policy} />}
                                </React.Fragment> }
                        </Text>
                        <Grid>
                            <GridItem span={12}>
                                <Text>
                                    Operating system: RHEL { majorOsVersion } (SSG { benchmark.version })
                                </Text>
                            </GridItem>
                            <GridItem className='pf-u-m-sm'/>
                            <GridItem style={{ display: 'inline-flex' }} span={12}>
                                <TextContent>
                                    <span style={{ fontSize: '30px', fontWeight: 'bold' }}>
                                        { compliantHostCount }
                                    </span>
                                    <span style={{ fontWeight: '500' }}>
                                        {' '}of{' '}
                                    </span>
                                    <span style={{ fontSize: '30px', fontWeight: 'bold' }}>
                                        { totalHostCount }
                                    </span>
                                </TextContent>
                            </GridItem>
                            <GridItem span={12}>
                                <Text>
                                    Systems meet compliance threshold
                                </Text>
                            </GridItem>
                        </Grid>
                    </TextContent>
                </CardHeader>
                <CardBody>
                    <Grid>
                        <GridItem style={{ textAlign: 'center' }} span={12}>
                            <div className='chart-inline'>
                                <div className='card-chart-container'>
                                    <ChartDonut data={donutValues}
                                        identifier={name.replace(/ /g, '')}
                                        innerRadius={122}
                                        themeColor={ChartThemeColor.blue}
                                        themeVariant={ChartThemeVariant.light}
                                        title={compliancePercentage}
                                        subTitle="Compliant"
                                        height={300}
                                        width={300}
                                    />
                                </div>
                            </div>
                        </GridItem>
                    </Grid>
                </CardBody>
                <CardFooter>
                    <Grid>
                        <GridItem span={6}>
                            <TextContent>
                                <Text component={TextVariants.small} style={{ fontSize: '16px' }} >
                                    <Link to={'/reports/' + id} >
                                        View report
                                    </Link>
                                </Text>
                                <Text component={TextVariants.small} style={{ fontSize: '16px' }} >
                                    { external && refId !== benchmark.refId ? <Tooltip position='bottom' content={
                                        <span>This policy report was uploaded into the Compliance application.
                                        If you would like to manage your policy inside the Compliance application,
                                        use the &quot;Create a policy&quot; wizard to create one and associate systems.</span>
                                    }>
                                        <span>
                                            External SCAP policy <OutlinedQuestionCircleIcon className='grey-icon'/>
                                        </span>
                                    </Tooltip> :
                                        <Link to={'/scappolicies/' + id} >
                                            View policy
                                        </Link>
                                    }
                                </Text>
                            </TextContent>
                        </GridItem>
                    </Grid>
                </CardFooter>
            </Card>
        );
    };
};

ReportCard.propTypes = {
    policy: propTypes.object
};

export default ReportCard;
