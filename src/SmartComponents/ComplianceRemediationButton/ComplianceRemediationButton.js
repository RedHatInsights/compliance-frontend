import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { RemediationButton } from '@red-hat-insights/insights-frontend-components';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import './ComplianceRemediationButton.scss';

const GET_FAILED_RULES = gql`
query FailedRulesForSystem($systemIdsQuery: String!){
    allSystems(search: $systemIdsQuery) {
        id,
        rule_objects_failed {
            ref_id
        }
    }
}
`;

const FailedRulesQuery = graphql(GET_FAILED_RULES, {
    options: (props) => ({ variables: { systemIdsQuery: 'id ^ (' + props.selectedEntities.map(entity => entity.id) + ')' } }),
    props: ({ data }) => (data)
});

class ComplianceRemediationButton extends React.Component {
    constructor(props) {
        super(props);
        this.dataProvider = this.dataProvider.bind(this);
    }

    dataProvider() {
        let result = { issues: [], systems: [] };
        if (this.props.allSystems === undefined) {
            return result;
        }

        for (const system of this.props.allSystems) {
            result.systems.push(system.id);

            if (this.props.selectedRules !== undefined) {
                for (const rule of this.props.selectedRules) {
                    result.issues.push({ id: 'compliance:' + rule });
                }
            } else {
                for (const rule of system.rule_objects_failed) {
                    result.issues.push({ id: 'compliance:' + rule.ref_id });
                }
            }
        }

        return result;
    }

    render() {
        const { disableRemediations } = this.props;
        return (
            <div id='remediation-button' style={{ marginRight: '20px' }}>
                <RemediationButton
                    isDisabled={disableRemediations || this.dataProvider().issues.length === 0}
                    dataProvider={this.dataProvider}
                />
            </div>
        );
    }
}

ComplianceRemediationButton.propTypes = {
    selectedEntities: propTypes.array,
    selectedRules: propTypes.array,
    allSystems: propTypes.array, // Prop coming from data.allSystems GraphQL query
    disableRemediations: propTypes.bool
};

ComplianceRemediationButton.defaultProps = {
    disableRemediations: false
};

const mapStateToProps = state => {
    if (state.entities === undefined || state.entities.rows === undefined) {
        return { selectedEntities: [] };
    } else if (state.entityDetails !== undefined && state.entityDetails.entity !== undefined) {
        return { selectedEntities: [state.entityDetails.entity] };
    }

    return {
        selectedEntities: state.entities.rows.
        filter(entity => entity.selected)
    };
};

export default compose(
    connect(mapStateToProps),
    FailedRulesQuery
)(ComplianceRemediationButton);
