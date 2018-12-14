import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import { routerParams } from '@red-hat-insights/insights-frontend-components';
import SystemPolicyCard from '../SystemPolicyCard/SystemPolicyCard';
import propTypes from 'prop-types';

class SystemPolicyCards extends React.Component {
    constructor(props) {
        super(props);
    }

    systemPolicyCards() {
        const policyCards = this.props.policies.map(
            (policy, i) =>
                <GridItem span={4} key={i}>
                    <SystemPolicyCard policy={policy} />
                </GridItem>
        );
        return policyCards;
    }

    render() {
        if (this.props.policies === undefined) {
            return ('Loading policy information...');
        } else {
            return (
                <div id="system_policy_cards">
                    <Grid gutter='md'>
                        { this.systemPolicyCards() }
                    </Grid>
                </div>
            );
        }
    }
}

SystemPolicyCards.propTypes = {
    policies: propTypes.array
};

export default routerParams(SystemPolicyCards);
