import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useHistory, useLocation } from 'react-router-dom';
import propTypes from 'prop-types';
import {
    PageHeader,
    Main,
    Skeleton,
    SkeletonSize
} from '@redhat-cloud-services/frontend-components';
import { onNavigate } from '../../Utilities/Breadcrumbs';
import {
    Breadcrumb,
    BreadcrumbItem
} from '@patternfly/react-core';
import InventoryDetails from 'SmartComponents';
import ComplianceSystemDetails from '@redhat-cloud-services/frontend-components-inventory-compliance';
import gql from 'graphql-tag';

const QUERY = gql`
query System($inventoryId: String!){
    system(id: $inventoryId) {
        name
    }
}
`;

export const SystemDetails = (props) => {
    let history = useHistory();
    let location = useLocation();
    const {
        match: { params: { inventoryId } }
    } = props;
    const hidePassed = location.query && location.query.hidePassed;
    const { data, error, loading } = useQuery(QUERY, {
        variables: { inventoryId }
    });

    if (error) {
        if (error.networkError.statusCode === 401) {
            window.insights.chrome.auth.logout();
        }

        return 'Oops! Error loading Systems data: ' + error;
    }

    if (loading) {
        return (<PageHeader><Skeleton size={ SkeletonSize.md } /></PageHeader>);
    }

    return (
        <React.Fragment>
            <PageHeader>
                <Breadcrumb>
                    <BreadcrumbItem to='/rhel/compliance/systems' onClick={ (event) => onNavigate(event, history) }>
                        Systems
                    </BreadcrumbItem>
                    <BreadcrumbItem isActive>{data.system.name}</BreadcrumbItem>
                </Breadcrumb>
                <InventoryDetails />
                <br/>
            </PageHeader>
            <Main>
                <ComplianceSystemDetails hidePassed={hidePassed} />
            </Main>
        </React.Fragment>
    );
};

SystemDetails.propTypes = {
    match: propTypes.object,
    location: propTypes.object
};

export default SystemDetails;
