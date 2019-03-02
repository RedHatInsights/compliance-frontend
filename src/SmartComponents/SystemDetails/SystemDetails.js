import React from 'react';
import propTypes from 'prop-types';
import { Breadcrumbs, PageHeader, Main, routerParams } from '@red-hat-insights/insights-frontend-components';
import { onNavigate } from '../../Utilities/Breadcrumbs';
import InventoryDetails from '../InventoryDetails/InventoryDetails';
import { Compliance as ComplianceSystemDetails } from '@red-hat-insights/insights-frontend-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const QUERY = gql`
query System($inventoryId: String!){
    system(id: $inventoryId) {
        name
    }
}
`;

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
                    if (error) {
                        if (error.networkError.statusCode === 401) {
                            window.insights.chrome.auth.logout();
                        }

                        return 'Oops! Error loading Systems data: ' + error;
                    }

                    if (loading) {
                        return (<PageHeader>Loading System details...</PageHeader>);
                    }

                    return (
                        <React.Fragment>
                            <PageHeader>
                                <Breadcrumbs
                                    style={{ padding: '0px' }}
                                    items={[{ title: 'Systems', navigate: '/systems' }]}
                                    current={data.system.name}
                                    onNavigate={this.onNavigate}
                                />
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
