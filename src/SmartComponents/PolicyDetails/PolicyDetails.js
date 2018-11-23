import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { routerParams } from '@red-hat-insights/insights-frontend-components';
import { connect } from 'react-redux';
import { fetchPolicyDetails } from '../../store/Actions/PolicyActions';
import CompliancePolicyDonut from '../CompliancePolicyDonut/CompliancePolicyDonut';
import {
    Title,
    Text,
    TextContent,
    TextVariants
} from '@patternfly/react-core';

class PolicyDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            policy: {},
            loading: true
        };
    };

    componentDidMount() {
        this.setState({ loading: true });
        this.props.fetchData(this.props.match.params.policy_id);
    };

    componentDidUpdate(prevProps) {
        if (prevProps.policy !== this.props.policy) {
            this.setState({ loading: this.props.loading, policy: this.props.policy });
        }
    }

    handleRedirect() {
        this.props.history.push('/policies/' + this.props.match.params.policy_id);
    }

    render() {
        const { policy, loading } = this.state;
        return (
            <React.Fragment>
                { (loading) ? <span>Loading Policies...</span> :
                    <Title size="3xl">{policy.attributes.name}</Title> }
                <Grid gutter='md'>
                    <GridItem span={6}>
                        { (loading) ?
                            <span>Loading Policies...</span> :
                            <CompliancePolicyDonut
                                policy={policy}
                                height={200}
                                width={200}
                                showLegend={true}
                                legendHorizontal={false}
                            />
                        }
                    </GridItem>
                    <GridItem span={6}>
                        { (loading) ? <span>Loading Policies...</span> :
                            <TextContent>
                                <Text component={TextVariants.h3}>Description</Text>
                                <Text className="policy-description" component={TextVariants.p}>
                                    {policy.attributes.description}
                                </Text>
                            </TextContent> }
                    </GridItem>
                    <GridItem span={12}>
                        Systems table
                    </GridItem>
                </Grid>
            </React.Fragment>
        );
    };
};

PolicyDetails.propTypes = {
    match: propTypes.object,
    history: propTypes.object,
    fetchData: propTypes.func,
    policy: propTypes.object,
    loading: propTypes.bool
};

const mapStateToProps = (state) => ({
    policy: state.PolicyReducer.policy.result,
    loading: state.PolicyReducer.policy.isLoading
});

const mapDispatchToProps = dispatch => {
    return {
        fetchData: (policyId) => dispatch(fetchPolicyDetails(policyId))
    };
};

export default routerParams(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PolicyDetails)
);
