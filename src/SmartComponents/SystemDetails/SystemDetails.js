import React from 'react';
import propTypes from 'prop-types';
import { routerParams } from '@red-hat-insights/insights-frontend-components';
import InventoryDetails from '../InventoryDetails/InventoryDetails';
import SystemPolicyCards from '../SystemPolicyCards/SystemPolicyCards';
import SystemRulesTable from '../SystemRulesTable/SystemRulesTable';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Text, TextVariants, TextContent } from '@patternfly/react-core';
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
    render() {
        const systemId = this.props.match.params.inventoryId;
        return (
            <Query query={QUERY} variables={{ systemId }}>
                {({ data, error, loading }) => {
                    let rules = {};
                    if (error) { return 'Oops! Error loading System data: ' + error; }

                    if (loading) {
                        return 'Loading System details...';
                    } else {
                        rules = data.system.profiles.map((profile) => ({
                            profile: profile.name,
                            rules: profile.rules
                        }));
                    }

                    return (
                        <div>
                            <InventoryDetails />
                            <br/>
                            <SystemPolicyCards policies={data.system.profiles} />
                            <br/>
                            <TextContent>
                                <Text component={TextVariants.h2}>Rules Checked</Text>
                            </TextContent>
                            <SystemRulesTable profileRules={rules} />
                        </div>
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
