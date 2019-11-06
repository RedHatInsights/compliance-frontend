import React from 'react';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { ErrorPage } from 'PresentationalComponents';
import ImageStreamsWizard from '../ImageStreamsWizard/ImageStreamsWizard';

const QUERY = gql`
{
    allImageStreams {
        id
        name
        profile_names
        compliant
    }
}
`;

// TODO: This looks odd. the query should probably be in ImageStreamsWizard
// TODO: The query should also be executed via the useQuery hook
const ComplianceImageStreamsTable = () => (
    <Query query={QUERY}>
        {({ data, error, loading }) => {
            if (error) { return <ErrorPage error={error} data={data} />; }

            if (loading) { return 'Loading Image Streams...'; }

            const imageStreams = <ImageStreamsWizard/>;

            return imageStreams;
        }}
    </Query>
);

export default routerParams(ComplianceImageStreamsTable);
