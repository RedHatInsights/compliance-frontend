import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPolicyDetails } from '../../store/Actions/PolicyActions';
import { fetchSystems } from '../../store/Actions/SystemActions';
import SystemsTable from './SystemsTable';
import { Donut, routerParams } from '@red-hat-insights/insights-frontend-components';
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
            systems: [],
            loading: true
        };
    };

    componentDidMount() {
        this.setState({ loading: true });
        this.props.fetchData(this.props.match.params.policy_id);
        this.props.fetchSystems(this.props.match.params.policy_id);
    };

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                loading: this.props.loading,
                systems: this.props.systems,
                policy: this.props.policy
            });
        }
    }

    handleRedirect() {
        this.props.history.push('/policies/' + this.props.match.params.policy_id);
    }

    render() {
        const { policy, systems, loading } = this.state;
        let donutValues = [];
        let donutId = 'loading-donut';
        if (!loading) {
            const compliantHostCount = policy.attributes.compliant_host_count;
            const totalHostCount = policy.attributes.total_host_count;
            donutId = policy.attributes.name.replace(/ /g, '');
            donutValues = [
                ['Compliant', compliantHostCount],
                ['Non-compliant', totalHostCount - compliantHostCount]
            ];
        }

        return (
            <React.Fragment>
                { (loading) ? <span>Loading Policies...</span> :
                    <Title size="3xl">{policy.attributes.name}</Title> }
                <Grid gutter='md'>
                    <GridItem span={6}>
                        { (loading) ?
                            <span>Loading Policies...</span> :
                            <Donut values={donutValues}
                                identifier={donutId}
                                withLegend
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
                        <SystemsTable items={systems} />
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
    fetchSystems: propTypes.func,
    policy: propTypes.object,
    systems: propTypes.array,
    loading: propTypes.bool
};

const mapStateToProps = (state) => ({
    policy: state.PolicyReducer.policy.result,
    systems: state.SystemReducer.systemsList.items,
    loading: state.PolicyReducer.policy.isLoading
});

const mapDispatchToProps = dispatch => {
    return {
        fetchData: (policyId) => dispatch(fetchPolicyDetails(policyId)),
        fetchSystems: (policyId) => dispatch(fetchSystems('profile_id=' + policyId))
    };
};

export default routerParams(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PolicyDetails)
);
