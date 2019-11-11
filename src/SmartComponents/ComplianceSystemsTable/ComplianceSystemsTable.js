import React from 'react';
import { EmptyTable, Spinner } from '@redhat-cloud-services/frontend-components';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import SystemsTable from '../SystemsTable/SystemsTable';
import { ErrorPage } from 'PresentationalComponents';

const QUERY = gql`
{
    systems(first: 1) {
        totalCount
    }
}
`;

const ComplianceSystemsTable = () => (
    <Query query={QUERY}>
        {({ data, error, loading }) => {
            if (error) { return <ErrorPage error={error}/>; }

            if (loading) { return <EmptyTable><Spinner/></EmptyTable>; }

            const totalCount = data.systems.totalCount;
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
                    width: 40
                }
            }, {
                key: 'facts.compliance.compliance_score',
                title: 'Compliance score',
                props: {
                    width: 10
                }
            }, {
                key: 'facts.compliance.last_scanned',
                title: 'Last scanned',
                props: {
                    width: 10
                }
            }];

            return <SystemsTable items={[]} columns={columns} systemsCount={totalCount}/>;
        }}
    </Query>
);

export default routerParams(ComplianceSystemsTable);
