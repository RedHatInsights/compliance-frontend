import React from 'react';
import propTypes from 'prop-types';
import {
    PageHeader,
    Main,
    Skeleton,
    SkeletonSize
} from '@redhat-cloud-services/frontend-components';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import { onNavigate } from '../../Utilities/Breadcrumbs';
import {
    Breadcrumb,
    BreadcrumbItem
} from '@patternfly/react-core';
import InventoryDetails from '../InventoryDetails/InventoryDetails';
import ComplianceSystemDetails from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const QUERY = gql`
query System($inventoryId: String!){
    system(id: $inventoryId) {
        name
    }
}
`;

// TODO: this is a very strange component...
class SystemDetails extends React.Component {
    constructor(props) {
        super(props);
        this.onNavigate = onNavigate.bind(this);
    }

    render() {
        const {
            match: { params: { inventoryId } }
        } = this.props;
        const hidePassed = this.props.location.query && this.props.location.query.hidePassed;
        return (
            <Query query={QUERY} variables={{ inventoryId }}>
                {({ data, error, loading }) => {
                    // TODO: we should set a onError handler as a defaultOption for the Apollo client
                    // this way we can handle all sorts of errors in one place and consistantly throught all queries
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
                                    <BreadcrumbItem to='/rhel/compliance/systems' onClick={ (event) => this.onNavigate(event) }>
                                        Systems
                                    </BreadcrumbItem>
                                    <BreadcrumbItem isActive>{data.system.name}</BreadcrumbItem>
                                </Breadcrumb>
                                <InventoryDetails sendData={this.getData} />
                                <br/>
                            </PageHeader>
                            <Main>
                                <ComplianceSystemDetails hidePassed={hidePassed} />
                            </Main>
                        </React.Fragment>
                    );
                }}
            </Query>
        );
    }
}

SystemDetails.propTypes = {
    match: propTypes.object,
    location: propTypes.object
};

export default routerParams(SystemDetails);
