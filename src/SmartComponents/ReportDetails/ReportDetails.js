import React, { useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, GridItem } from '@patternfly/react-core';
import propTypes from 'prop-types';
import SystemsTable from '../SystemsTable/SystemsTable';
import { onNavigate } from '../../Utilities/Breadcrumbs';
import { fixedPercentage, pluralize } from '../../Utilities/TextHelper';
import {
    ReportDetailsContentLoader,
    ReportDetailsDescription
} from '../../PresentationalComponents';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import {
    PageHeader,
    PageHeaderTitle,
    Main,
    EmptyTable,
    Spinner
} from '@redhat-cloud-services/frontend-components';
import {
    ChartDonut,
    ChartThemeColor,
    ChartThemeVariant
} from '@patternfly/react-charts';
import {
    Breadcrumb,
    BreadcrumbItem
} from '@patternfly/react-core';
import gql from 'graphql-tag';
import '../../Charts.scss';
import './ReportDetails.scss';

export const QUERY = gql`
query Profile($policyId: String!){
    profile(id: $policyId) {
        id
        name
        refId
        totalHostCount
        compliantHostCount
        complianceThreshold
        majorOsVersion
        lastScanned
        businessObjective {
            id
            title
        }
    }
}
`;

export const ReportDetailsQuery = ({ policyId, onNavigateWithProps }) => {
    const { data, error, loading } = useQuery(QUERY, {
        variables: { policyId }
    });
    let systemsTable = useRef();
    let donutValues = [];
    let donutId = 'loading-donut';
    let policy = {};

    if (error) {
        if (error.networkError.statusCode === 401) {
            window.insights.chrome.auth.logout();
        }

        return 'Oops! Error loading Policy data: ' + error;
    }

    if (loading) {
        return (
            <React.Fragment>
                <PageHeader><ReportDetailsContentLoader/></PageHeader>
                <Main><EmptyTable><Spinner/></EmptyTable></Main>
            </React.Fragment>
        );
    } else {
        policy = data.profile;
        const compliantHostCount = policy.compliantHostCount;
        const totalHostCount = policy.totalHostCount;
        donutId = policy.name.replace(/ /g, '');
        donutValues = [
            { x: 'Compliant', y: compliantHostCount },
            { x: 'Non-compliant', y: totalHostCount - compliantHostCount }
        ];
    }

    const columns = [{
        composed: ['facts.os_release', 'display_name'],
        key: 'display_name',
        title: 'Name',
        props: {
            width: 30
        }
    }, {
        key: 'facts.compliance.rules_failed',
        title: 'Rules failed',
        props: {
            width: 5
        }
    }, {
        key: 'facts.compliance.compliance_score',
        title: 'Compliance score',
        props: {
            width: 5
        }
    }, {
        key: 'facts.compliance.last_scanned',
        title: 'Last scanned',
        props: {
            width: 10
        }
    }];

    const legendData = [
        { name: donutValues[0].y + ' ' + pluralize(donutValues[0].y, 'system') + ' compliant' },
        { name: donutValues[1].y + ' ' + pluralize(donutValues[1].y, 'system') + ' non-compliant' }
    ];

    const compliancePercentage = fixedPercentage(Math.floor(100 *
        (donutValues[0].y / (donutValues[0].y + donutValues[1].y))));

    return (
        <React.Fragment>
            <PageHeader>
                <Breadcrumb>
                    <BreadcrumbItem to='/rhel/compliance/reports' onClick={ (event) => onNavigateWithProps(event) }>
                        Reports
                    </BreadcrumbItem>
                    <BreadcrumbItem isActive>{policy.name}</BreadcrumbItem>
                </Breadcrumb>
                <PageHeaderTitle title={policy.name + ' report'} />
                <Grid gutter='md'>
                    <GridItem sm={12} md={12} lg={12} xl={6}>
                        <div className='chart-inline'>
                            <div className='chart-container'>
                                <ChartDonut data={donutValues}
                                    identifier={donutId}
                                    title={compliancePercentage}
                                    subTitle="Compliant"
                                    themeColor={ChartThemeColor.blue}
                                    themeVariant={ChartThemeVariant.light}
                                    style={{ fontSize: 20 }}
                                    innerRadius={88}
                                    width={462}
                                    legendPosition='right'
                                    legendData={legendData}
                                    legendOrientation='vertical'
                                    padding={{
                                        bottom: 20,
                                        left: 0,
                                        right: 250,
                                        top: 20
                                    }}
                                />
                            </div>
                        </div>

                    </GridItem>
                    <GridItem sm={12} md={12} lg={12} xl={6}>
                        <ReportDetailsDescription policy={policy} />
                    </GridItem>
                </Grid>
            </PageHeader>
            <Main>
                <Grid gutter='md'>
                    <GridItem span={12}>
                        <SystemsTable policyId={policy.id}
                            columns={columns}
                            ref={systemsTable} />
                    </GridItem>
                </Grid>
            </Main>
        </React.Fragment>
    );
};

ReportDetailsQuery.propTypes = {
    policyId: propTypes.string,
    onNavigateWithProps: propTypes.func
};

export class ReportDetails extends React.Component {
    constructor(props) {
        super(props);
        this.onNavigate = onNavigate.bind(this);
    }

    render() {
        return (
            <ReportDetailsQuery policyId={this.props.match.params.report_id} onNavigateWithProps={this.onNavigate} />
        );
    }
}

ReportDetails.propTypes = {
    match: propTypes.object
};

export default routerParams(ReportDetails);
