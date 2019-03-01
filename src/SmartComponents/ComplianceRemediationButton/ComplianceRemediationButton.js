import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { RemediationButton } from '@red-hat-insights/insights-frontend-components';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import flatten from 'lodash/flatten';

const GET_FAILED_RULES = gql`
query FailedRulesForSystem($systemIdsQuery: String!){
    allSystems(search: $systemIdsQuery) {
        id,
        rule_objects_failed {
            ref_id,
            title
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
    }

    /* eslint-disable camelcase */
    formatRule = ({ title, ref_id }, system) => ({
        id: `compliance:${ref_id}`,
        description: title,
        systems: [
            system
        ]
    })

    findRule = (rules, ref_id) => {
        const prefix = 'compliance:';
        return rules.find(rule => rule.ref_id === ref_id.slice(prefix.length));
    }

    uniqIssuesBySystem = (issues) => {
        const issueIds = issues.map((issue) => issue.id);
        return issues.filter((issue, index) => {
            const originalIssueIndex = issueIds.indexOf(issue.id);
            return (originalIssueIndex === index) ? true :
                (issues[originalIssueIndex].systems = issues[originalIssueIndex].systems.concat(issue.systems)) && false;
        });
    }

    rulesWithRemediations = (rules, id) => {
        return window.insights.chrome.auth.getUser()
        .then(() => {
            return fetch('/r/insights/platform/remediations/v1/resolutions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; chartset=utf-8' },
                body: JSON.stringify({ issues: rules.map(rule => `compliance:${rule.ref_id}`) })
            }).then((response) => {
                if (!response.ok) {
                    // If remediations doesn't respond, inject no fix available
                    return {};
                }

                return response.json();
            }).then(response => Object.keys(response).filter(rule => response[rule]).map(
                rule_ref_id => this.formatRule(this.findRule(rules, rule_ref_id), id)
            ));
        });
    }

    dataProvider = () => {
        const { allSystems, selectedRules } = this.props;
        const result = { systems: [], issues: [] };
        allSystems.forEach(async (system) => {
            result.systems.push(system.id);
            if (selectedRules) {
                result.issues.push(selectedRules.map(rule => this.formatRule(rule, system.id)));
            } else {
                result.issues.push(this.rulesWithRemediations(system.rule_objects_failed, system.id));
            }
        });

        return Promise.all(result.issues).then(issues => {
            result.issues = this.uniqIssuesBySystem(flatten(issues));
            return result;
        });
        //        return allSystems.reduce(async (acc, { id, rule_objects_failed }) => ({
        //            systems: [...acc.systems, id],
        //            issues: [
        //                ...acc.issues,
        //                ...selectedRules ? selectedRules.map(rule => this.formatRule(rule, id)) :
        //                    await(this.rulesWithRemediations(rule_objects_failed, id))
        //            ]
        //        }), { issues: [], systems: [] });
    }
    /* eslint-enable camelcase */

    render() {
        const { allSystems } = this.props;

        return (
            <React.Fragment>
                <RemediationButton
                    isDisabled={ allSystems.length === 0 || allSystems[0].rule_objects_failed.length === 0 }
                    dataProvider={ this.dataProvider }
                />
            </React.Fragment>
        );
    }
}

ComplianceRemediationButton.propTypes = {
    selectedEntities: propTypes.array,
    selectedRules: propTypes.array,
    allSystems: propTypes.array // Prop coming from data.allSystems GraphQL query
};

ComplianceRemediationButton.defaultProps = {
    allSystems: []
};

const mapStateToProps = ({ entities, entityDetails }) => ({
    selectedEntities: entities && entities.rows ?
        entityDetails && entityDetails.entity ?
            [entityDetails.entity] :
            entities.rows.filter(entity => entity.selected) :
        []

});

export default compose(
    connect(mapStateToProps),
    FailedRulesQuery
)(ComplianceRemediationButton);
