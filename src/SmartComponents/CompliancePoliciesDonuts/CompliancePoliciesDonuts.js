import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import { routerParams } from '@red-hat-insights/insights-frontend-components';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import CompliancePolicyCard from '../CompliancePolicyCard/CompliancePolicyCard';
import { fetchPolicies } from '../../store/Actions/PolicyActions';

class CompliancePoliciesDonuts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            policies: [],
            loading: false
        };
    };

    componentDidMount() {
        this.setState({ loading: true });
        this.props.fetchData();
    };

    componentDidUpdate(prevProps) {
        if (prevProps.policies !== this.props.policies) {
            this.setState({ loading: this.props.loading, policies: this.props.policies });
        }
    }

    handleRedirect() {
        this.props.history.push('/policies/');
    }

    render() {
        const { policies, loading } = this.state;
        let policyCards = [];
        if (policies.length) {
            policyCards = policies.map(
                (policy, i) =>
                    <GridItem span={3} key={i}>
                        <CompliancePolicyCard
                            key={i}
                            policy={policy}
                        />
                    </GridItem>
            );
        }

        return (
            <div className="policies-donuts">
                { (loading) ? <span>Loading Policies...</span> : '' }
                <Grid gutter='md'>
                    {policyCards}
                </Grid>
            </div>
        );
    };

};

CompliancePoliciesDonuts.propTypes = {
    history: propTypes.object,
    fetchData: propTypes.func,
    policies: propTypes.array,
    loading: propTypes.bool
};

const mapStateToProps = (state) => ({
    policies: state.PolicyReducer.policiesList.items,
    loading: state.PolicyReducer.policiesList.isLoading
});

const mapDispatchToProps = dispatch => {
    return {
        fetchData: () => dispatch(fetchPolicies())
    };
};

export default routerParams(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CompliancePoliciesDonuts)
);
