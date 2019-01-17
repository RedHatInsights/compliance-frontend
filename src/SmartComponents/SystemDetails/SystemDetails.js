import React from 'react';
import propTypes from 'prop-types';
import { Breadcrumbs, PageHeader, Main, routerParams } from '@red-hat-insights/insights-frontend-components';
import { onNavigate } from '../../Utilities/Breadcrumbs';
import InventoryDetails from '../InventoryDetails/InventoryDetails';
import SystemPolicyCards from '../SystemPolicyCards/SystemPolicyCards';
import SystemRulesTable from '../SystemRulesTable/SystemRulesTable';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, CardBody } from '@patternfly/react-core';
const QUERY = gql`
query System($systemId: String!){
    system(id: $systemId) {
        id
        name
        profiles {
            name
            ref_id
            compliant(system_id: $systemId)
            rules_failed(system_id: $systemId)
            rules_passed(system_id: $systemId)
            last_scanned(system_id: $systemId)
            rules {
                title
                severity
                rationale
                ref_id
                description
                compliant(system_id: $systemId)
            }
        }
	}
}
`;

class SystemDetails extends React.Component {
    constructor(props) {
        super(props);
        this.onNavigate = onNavigate.bind(this);
    }

    render() {
        const systemId = this.props.match.params.inventoryId;
        return (
            <Query query={QUERY} variables={{ systemId }}>
                {({ data, error, loading }) => {
                    let rules = {};
                    if (error) { return 'Oops! Error loading System data: ' + error; }

                    if (loading) {
                        return (<PageHeader>Loading System details...</PageHeader>);
                    } else {
                        rules = data.system.profiles.map((profile) => ({
                            profile: profile.name,
                            rules: profile.rules
                        }));
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
                                <InventoryDetails />
                                <br/>
                            </PageHeader>
                            <Main>
                                <SystemPolicyCards policies={data.system.profiles} />
                                <br/>
                                <Card>
                                    <CardBody>
                                        <SystemRulesTable profileRules={rules} />
                                    </CardBody>
                                </Card>
                            </Main>
                        </React.Fragment>
                    );
                }}
            </Query>
        );
    }
}

SystemDetails.propTypes = {
    match: propTypes.object
};

export default routerParams(SystemDetails);
