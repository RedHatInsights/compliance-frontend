import React from 'react';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorPage from '../ErrorPage/ErrorPage';
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
