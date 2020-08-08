import React from 'react';
import gql from 'graphql-tag';
import {
    useQuery
} from '@apollo/react-hooks';
import {
    useLocation,
    useParams
} from 'react-router-dom';
import {
    PageHeader,
    Main,
    Skeleton,
    SkeletonSize
} from '@redhat-cloud-services/frontend-components';
import {
    Breadcrumb,
    BreadcrumbItem
} from '@patternfly/react-core';
import ComplianceSystemDetails from '@redhat-cloud-services/frontend-components-inventory-compliance';
import {
    BreadcrumbLinkItem,
    StateViewWithError,
    StateViewPart
} from 'PresentationalComponents';
import { InventoryDetails } from 'SmartComponents';

const QUERY = gql`
query System($inventoryId: String!){
    system(id: $inventoryId) {
        id
        name
    }
}
`;

export const SystemDetails = () => {
    const { inventoryId } = useParams();
    const { data, error, loading } = useQuery(QUERY, {
        variables: { inventoryId }
    });
    const location = useLocation();
    const hidePassed = location.query && location.query.hidePassed;
    const systemName = data?.system?.name;

    return <StateViewWithError stateValues={ { error, data, loading } }>
        <StateViewPart stateKey='data'>
            <PageHeader>
                <Breadcrumb>
                    <BreadcrumbLinkItem to='/systems'>
                        Systems
                    </BreadcrumbLinkItem>
                    <BreadcrumbItem isActive>{ systemName }</BreadcrumbItem>
                </Breadcrumb>
                <InventoryDetails />
                <br/>
            </PageHeader>
            <Main>
                <ComplianceSystemDetails hidePassed={ hidePassed } inventoryId={ inventoryId } />
            </Main>
        </StateViewPart>
        <StateViewPart stateKey='loading'>
            <PageHeader>
                <Skeleton size={ SkeletonSize.md } />
            </PageHeader>
        </StateViewPart>
    </StateViewWithError>;
};

export default SystemDetails;
