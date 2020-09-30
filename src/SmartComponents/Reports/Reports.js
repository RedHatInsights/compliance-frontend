import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { PageHeader, PageHeaderTitle, Main, SkeletonTable } from '@redhat-cloud-services/frontend-components';
import {
    ReportCardGrid, ReportsTable, StateViewPart, StateViewWithError, ReportsEmptyState, LoadingComplianceCards
} from 'PresentationalComponents';
import useFeature from 'Utilities/hooks/useFeature';

const QUERY = gql`
{
    profiles(search: "has_test_results = true", limit: 1000){
        edges {
            node {
                id
                name
                refId
                description
                totalHostCount
                compliantHostCount
                majorOsVersion
                complianceThreshold
                businessObjective {
                    id
                    title
                }
                policy {
                    id
                    name
                    benchmark {
                        id
                        version
                    }
                }
                benchmark {
                    id
                    version
                }
            }
        }

    }
}
`;

const profilesFromEdges = (data) => (
    (data?.profiles?.edges || []).map((profile) => (
        profile.node
    )).filter((profile) => (
        profile.totalHostCount > 0
    ))
);

const LoadingView = ({ showTableView }) => (
    showTableView ? <SkeletonTable colSize={ 3 } rowSize={ 10 } /> : <LoadingComplianceCards />
);

LoadingView.propTypes = {
    showTableView: propTypes.bool
};

const ReportsHeader = () => (
    <PageHeader>
        <PageHeaderTitle title="Reports" />
    </PageHeader>
);

export const Reports = () => {
    let profiles = [];
    let showView = false;
    const location = useLocation();
    let { data, error, loading, refetch } = useQuery(QUERY);
    const showTableView = useFeature('reportsTableView');
    const View = showTableView ? ReportsTable : ReportCardGrid;

    useEffect(() => {
        refetch();
    }, [location]);

    if (data) {
        profiles = profilesFromEdges(data);
        error = undefined;
        loading = undefined;
        showView = profiles && profiles.length > 0;
    }

    return <StateViewWithError stateValues={ { error, data, loading } }>
        <StateViewPart stateKey='loading'>
            <ReportsHeader />
            <Main>
                <LoadingView { ...{ showTableView } } />
            </Main>
        </StateViewPart>
        <StateViewPart stateKey='data'>
            <ReportsHeader />
            <Main>
                { showView ? <View { ...{ profiles } } /> : <ReportsEmptyState /> }
            </Main>
        </StateViewPart>
    </StateViewWithError>;
};

export default Reports;
