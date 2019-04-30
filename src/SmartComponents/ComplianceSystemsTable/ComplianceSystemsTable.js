import React from 'react';
import { routerParams, EmptyTable, Spinner } from '@red-hat-insights/insights-frontend-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import SystemsTable from '../SystemsTable/SystemsTable';
import ErrorPage from '../ErrorPage/ErrorPage';

const QUERY = gql`
{
    allSystems(per_page: 50, page: 1) {
        id
        name
        profile_names
        compliant
    }
}
`;

const ComplianceSystemsTable = () => (
    <Query query={QUERY}>
        {({ data, error, loading }) => {
            if (error) { return <ErrorPage error={error}/>; }

            if (loading) { return <EmptyTable><Spinner/></EmptyTable>; }

            const systems = data.allSystems;
            const columns = [{
                composed: ['facts.os_release', 'display_name'],
                key: 'display_name',
                title: 'Name',
                props: {
                    width: 40
                }
            }, {
                key: 'facts.compliance.profiles',
                title: 'Profiles',
                props: {
                    width: 50
                }
            }, {
                key: 'facts.compliance.compliant',
                title: 'Compliant',
                props: {
                    width: 10
                }
            }];

            return <SystemsTable items={systems} columns={columns} />;
        }}
    </Query>
);

export default routerParams(ComplianceSystemsTable);
