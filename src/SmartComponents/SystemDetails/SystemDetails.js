import React from 'react';
import gql from 'graphql-tag';
import {
    useQuery
} from '@apollo/react-hooks';
import {
    useHistory,
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
    onNavigate
} from 'Utilities/Breadcrumbs';

import InventoryDetails from 'SmartComponents';

const QUERY = gql`
query System($inventoryId: String!){
    system(id: $inventoryId) {
        name
    }
}
`;

const SystemDetails = () => {
    const history = useHistory();
    const location = useLocation();
    const hidePassed = location.query && location.query.hidePassed;
    const { inventoryId } = useParams();
    const { data, error, loading } = useQuery(QUERY, {
        variables: { inventoryId }
    });
    const onClick = (event) => onNavigate(event, history);

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
                    <BreadcrumbItem to='/rhel/compliance/systems' onClick={ onClick }>
                        Systems
                    </BreadcrumbItem>
                    <BreadcrumbItem isActive>{ data.system.name }</BreadcrumbItem>
                </Breadcrumb>
                <InventoryDetails />
                <br/>
            </PageHeader>
            <Main>
                { inventoryId &&
                    <ComplianceSystemDetails hidePassed={ hidePassed } inventoryId={ inventoryId } /> }
            </Main>
        </React.Fragment>
    );
};

export default SystemDetails;
