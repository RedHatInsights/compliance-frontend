/* eslint-disable react/display-name */
import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';

import black300 from '@patternfly/react-tokens/dist/esm/global_palette_black_300';
import blue200 from '@patternfly/react-tokens/dist/esm/chart_color_blue_200';
import blue300 from '@patternfly/react-tokens/dist/esm/chart_color_blue_300';
import propTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { ChartDonut, ChartThemeVariant } from '@patternfly/react-charts';
import { Breadcrumb, BreadcrumbItem, Button, Grid, GridItem, Text } from '@patternfly/react-core';

import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Main from '@redhat-cloud-services/frontend-components/Main';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';

import { fixedPercentage, pluralize } from 'Utilities/TextHelper';
import {
    BackgroundLink, BreadcrumbLinkItem, ReportDetailsContentLoader, ReportDetailsDescription,
    StateViewWithError, StateViewPart, UnsupportedSSGVersion, SubPageTitle
} from 'PresentationalComponents';
import Cells from '@/SmartComponents/SystemsTable/Cells';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import { InventoryTable } from 'SmartComponents';
import '@/Charts.scss';
import './ReportDetails.scss';
import { GET_SYSTEMS } from '../SystemsTable/constants';
import { systemName } from 'Store/Reducers/SystemStore';
import { ComplianceScore as complianceScore } from 'PresentationalComponents';

export const QUERY = gql`
query Profile($policyId: String!){
    profile(id: $policyId) {
        id
        name
        refId
        testResultHostCount
        compliantHostCount
        unsupportedHostCount
        complianceThreshold
        majorOsVersion
        lastScanned
        policyType
        policy {
            id
            name
        }
        benchmark {
            id
            version
        }
        businessObjective {
            id
            title
        }
    }
}
`;

export const ReportDetails = ({ route }) => {
    const { report_id: policyId } = useParams();
    const { data, error, loading } = useQuery(QUERY, {
        variables: { policyId }
    });
    const dispatch = useDispatch();
    let donutValues = [];
    let donutId = 'loading-donut';
    let chartColorScale;
    let profile = {};
    let policyName;
    let legendData;
    let compliancePercentage;
    let pageTitle;

    if (!loading && data) {
        profile = data.profile;
        policyName = profile.policy.name;
        pageTitle = `Report: ${ policyName }`;
        const compliantHostCount = profile.compliantHostCount;
        const testResultHostCount = profile.testResultHostCount;
        donutId = profile.name.replace(/ /g, '');
        donutValues = [
            { x: 'Compliant', y: testResultHostCount ? compliantHostCount : '0' },
            { x: 'Non-compliant', y: testResultHostCount - compliantHostCount }
        ];
        chartColorScale = testResultHostCount === 0 && [black300.value] ||
            [blue300.value, blue200.value];
        legendData = [
            { name: donutValues[0].y + ' ' + pluralize(donutValues[0].y, 'system') + ' compliant' },
            { name: donutValues[1].y + ' ' + pluralize(donutValues[1].y, 'system') + ' non-compliant' }
        ];
        compliancePercentage = testResultHostCount ? fixedPercentage(Math.floor(100 *
                (donutValues[0].y / (donutValues[0].y + donutValues[1].y)))) : 0;
    }

    const columns = [{
        key: 'display_name',
        title: 'Name',
        props: {
            width: 30
        },
        renderFunc: systemName
    }, {
        key: 'ssgVersion',
        title: 'SSG version',
        props: {
            width: 5
        },
        renderFunc: (profile, ...rest) => {
            let realProfile = profile;
            if (typeof profile === 'string') {
                realProfile = rest[1];
            }

            return realProfile && <Cells.SSGVersion
                supported={ realProfile.supported }
                ssgVersion={ realProfile?.ssg_version || realProfile?.ssgVersion } />;
        }
    }, {
        key: 'rulesFailed',
        title: 'Failed rules',
        props: {
            width: 5
        },
        renderFunc: (name, id) => <Link to={{ pathname: `/systems/${id}` }}> {name} </Link>
    }, {
        key: 'score',
        title: 'Compliance score',
        props: {
            width: 5
        },
        renderFunc: (_score, _id, system) => complianceScore(system)
    }, {
        key: 'lastScanned',
        title: 'Last scanned',
        props: {
            width: 10
        },
        renderFunc: (lastScanned) => (
            (lastScanned instanceof Date) ?
                <DateFormat date={Date.parse(lastScanned)} type='relative' />
                : lastScanned
        )
    }];

    useLayoutEffect(() => { dispatch({ type: 'CLEAR_INVENTORY_ENTITIES' }); }, []);

    useTitleEntity(route, policyName);

    return <StateViewWithError stateValues={ { error, data, loading } }>
        <StateViewPart stateKey='loading'>
            <PageHeader><ReportDetailsContentLoader/></PageHeader>
            <Main><EmptyTable><Spinner/></EmptyTable></Main>
        </StateViewPart>
        <StateViewPart stateKey='data'>
            <PageHeader>
                <Breadcrumb>
                    <BreadcrumbLinkItem to='/'>
                        Compliance
                    </BreadcrumbLinkItem>
                    <BreadcrumbLinkItem to='/reports'>
                        Reports
                    </BreadcrumbLinkItem>
                    <BreadcrumbItem isActive>{ pageTitle }</BreadcrumbItem>
                </Breadcrumb>
                <Grid hasGutter>
                    <GridItem sm={9} md={9} lg={9} xl={9}>
                        <PageHeaderTitle title={ pageTitle } />
                        <SubPageTitle>
                            { profile.policyType }
                        </SubPageTitle>
                    </GridItem>
                    <GridItem className='report-details-button' sm={3} md={3} lg={3} xl={3}>
                        <BackgroundLink
                            state={ { profile } }
                            to={ `/reports/${ profile.id }/delete` }>
                            <Button variant='link' isInline>Delete report</Button>
                        </BackgroundLink>
                    </GridItem>
                </Grid>
                <Grid hasGutter>
                    <GridItem sm={12} md={12} lg={12} xl={6}>
                        <div className='chart-inline'>
                            <div className='chart-container'>
                                <ChartDonut data={donutValues}
                                    identifier={donutId}
                                    title={compliancePercentage}
                                    subTitle="Compliant"
                                    themeVariant={ChartThemeVariant.light}
                                    colorScale={chartColorScale}
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
                        {  profile.unsupportedHostCount > 0 && <Text>
                            <UnsupportedSSGVersion showHelpIcon>
                                <strong className='ins-c-warning-text'>
                                    { profile.unsupportedHostCount } systems not supported
                                </strong>
                            </UnsupportedSSGVersion>
                        </Text> }
                    </GridItem>
                    <GridItem sm={12} md={12} lg={12} xl={6}>
                        <ReportDetailsDescription profile={profile} />
                    </GridItem>
                </Grid>
            </PageHeader>
            <Main>
                <Grid hasGutter>
                    <GridItem span={12}>
                        <InventoryTable
                            query={GET_SYSTEMS}
                            showOnlySystemsWithTestResults
                            compliantFilter
                            defaultFilter={`with_results_for_policy_id = ${profile.id}`}
                            policyId={profile.id}
                            columns={columns} />
                    </GridItem>
                </Grid>
            </Main>
        </StateViewPart>
    </StateViewWithError>;
};

ReportDetails.propTypes = {
    route: propTypes.object
};

export default ReportDetails;
