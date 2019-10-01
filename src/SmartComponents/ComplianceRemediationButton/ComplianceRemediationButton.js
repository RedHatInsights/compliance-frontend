import React from 'react';
import { compose } from 'redux';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import RemediationButton from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import flatten from 'lodash/flatten';
import { dispatchAction } from '../../Utilities/Dispatcher';

const GET_FAILED_RULES = gql`
query FailedRulesForSystem($systemIdsQuery: String!){
    allSystems(search: $systemIdsQuery) {
        id,
        ruleObjectsFailed {
            refId,
            profiles {
                refId
            }
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
    formatRule = ({ title, refId }, profile, systems) => ({
        id: `ssg:rhel7|${profile}|${refId}`,
        description: title,
        systems
    })

    findRule = (rules, refId) => {
        return rules.find(rule => rule.refId === refId.split('|')[2]);
    }

    uniqIssuesBySystem = (issues) => {
        const issueIds = issues.map((issue) => issue.id);
        return issues.filter((issue, index) => {
            const originalIssueIndex = issueIds.indexOf(issue.id);
            return (originalIssueIndex === index) ? true :
                (issues[originalIssueIndex].systems = issues[originalIssueIndex].systems.concat(issue.systems)) && false;
        });
    }

    removeRefIdPrefix = (refId) => {
        const splitRefId = refId.toLowerCase().split('xccdf_org.ssgproject.content_profile_')[1];
        if (splitRefId) {
            return splitRefId;
        } else {
            // Sometimes the reports contain IDs like "stig-rhel7-disa" which we can pass
            // directly
            return refId;
        }
    }

    fetchRules = (rules) => {
        return window.insights.chrome.auth.getUser()
        .then(() => {
            return fetch('/api/remediations/v1/resolutions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; chartset=utf-8' },
                body: JSON.stringify({
                    issues: rules.map(rule => `ssg:rhel7|` +
                                      `${this.removeRefIdPrefix(rule.profiles[0].refId)}|` +
                                      `${rule.refId}`)
                })
            }).then((response) => {
                if (!response.ok) {
                    // If remediations doesn't respond, inject no fix available
                    return {};
                }

                return response.json();
            });
        });
    }

    rulesWithRemediations = (rules, rulesPerSystem) => {
        return this.fetchRules(rules).then(response => Object.keys(response).filter(rule => response[rule]).reduce(
            (acc, rule_refId) => {
                const rule = this.findRule(rules, rule_refId);
                acc.push(this.formatRule(rule, rule_refId.split('|')[1], rulesPerSystem[rule.refId]));
                return acc;
            }, []
        ));
    }

    dataProvider = () => {
        const { allSystems, selectedRules } = this.props;
        const result = { systems: [], issues: [] };

        allSystems.forEach(system => { result.systems.push(system.id); });

        if (selectedRules) {
            result.issues.push(selectedRules.map(rule => this.formatRule(rule, [allSystems[0].id])));
        } else {
            const rules = flatten(allSystems.map(system => system.ruleObjectsFailed));
            const rulesPerSystem = rules.reduce((acc, rule) => {
                acc[rule.refId] = allSystems.filter(
                    system => system.ruleObjectsFailed.map(rule => rule.refId).includes(rule.refId)
                ).map(system => system.id);
                return acc;
            }, {});
            result.issues.push(this.rulesWithRemediations(rules, rulesPerSystem));
        }

        return Promise.all(result.issues).then(issues => {
            result.issues = this.uniqIssuesBySystem(flatten(issues));
            return result;
        });
    }
    /* eslint-enable camelcase */

    onCreated = (result) => {
        dispatchAction(addNotification(result.getNotification()));
    }

    render() {
        const { allSystems } = this.props;

        return (
            <React.Fragment>
                <RemediationButton
                    isDisabled={ allSystems.length === 0 || allSystems[0].ruleObjectsFailed.length === 0 }
                    dataProvider={ this.dataProvider }
                    onRemediationCreated={ this.onCreated }
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
