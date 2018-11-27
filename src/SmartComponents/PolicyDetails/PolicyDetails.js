import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPolicyDetails } from '../../store/Actions/PolicyActions';
import { Donut, routerParams } from '@red-hat-insights/insights-frontend-components';
import { registry as registryDecorator } from '@red-hat-insights/insights-frontend-components';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
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
                        <SystemsTable />
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

@registryDecorator()
class SystemsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            InventoryCmp: () => <div>Loading...</div>
        };

        this.fetchInventory();
    }

    async fetchInventory() {
        const { inventoryConnector, mergeWithEntities, mergeWithDetail } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons
        });

        this.getRegistry().register({
            ...mergeWithEntities(),
            ...mergeWithDetail()
        });

        this.setState({
            InventoryCmp: inventoryConnector()
        });
    }

    render() {
        const { InventoryCmp } = this.state;
        return (
            <InventoryCmp />
        );
    }
}
