import React from 'react';
import { routerParams } from '@red-hat-insights/insights-frontend-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import SystemsTable from '../SystemsTable/SystemsTable';

const QUERY = gql`
{
    allSystems {
        name
        profile_names
        compliant
    }
}
`;

const ComplianceSystemsTable = () => (
    <Query query={QUERY}>
        {({ data, error, loading }) => {
            if (error) { return 'Oops! Error loading Systems data: ' + error; }

            if (loading) { return 'Loading Systems...'; }

            const systems = data.systems;
            return (
                <div className="systems-table">
                    <SystemsTable items={systems} />
                </div>
            );
        }}
    </Query>
);

export default routerParams(ComplianceSystemsTable);
