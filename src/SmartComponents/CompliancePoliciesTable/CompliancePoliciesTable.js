;import React from 'react';
import { Table, Pagination, Input, SortDirection, routerParams } from '@red-hat-insights/insights-frontend-components';
import { connect } from 'react-redux';
import { fetchPolicies } from '../../store/Actions/PolicyActions';
import propTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

class CompliancePoliciesTable extends React.Component {
    constructor(props) {
        super(props);
        this.sort = this.sort.bind(this);
        this.filter = this.filter.bind(this);
        this.state = {
            policiesList: [],
            filterValue: '',
            sortBy: {
                index: '',
                direction: SortDirection.up
            }
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state.policiesList === undefined || (state.policiesList.length === 0 && state.filterValue === '')) {
            return { ...state, policiesList: props.policiesList };
        }

        return {};
    }

    componentDidMount() {
        this.props.fetchData();
    }

    filter(value) {
        let filtered = this.props.policyTableRows.filter(item => item.synopsis.indexOf(value) !== -1);
        this.setState({ ...this.state, policyList: filtered, filterValue: value }, () =>
            this.sort(this.state.sortBy.index, this.state.sortBy.direction)
        );
    }

    sort(key, value) {
        let sorted = this.state.policyList;
        let direction = value === SortDirection.down ? 'desc' : 'asc';
        this.setState({ ...this.state, policiesList: sorted, sortBy: { index: key, direction } });
    }

    handleRedirect() {
        this.props.history.push('/profiles/');
    }

    render() {
        return (
            <React.Fragment>
                <Grid gutter="sm">
                    <GridItem span={3}>
                        <label htmlFor="search">Search: </label>
                        <Input
                            id="search"
                            type="text"
                            style={{ width: '200px' }}
                            onChange={event => this.filter(event.target.value)}
                        />{' '}
                        <SearchIcon style={{ paddingTop: '4px' }} />
                    </GridItem>

                    <GridItem span={12}>
                        <Table
                            header={['Name', 'Ref ID']}
                            rows={this.props.policyTableRows}
                            onRowClick={(event, key) => this.handleRedirect(key)}
                            onSort={(event, key, value) => this.sort(key, value)}
                            sortBy={this.state.sortBy}
                            footer={
                                <Pagination
                                    numberOfItems={
                                        this.state.filterValue === '' || this.state.policiesList.length === 11
                                            ? 1
                                            : this.state.policiesList.length
                                    }
                                    itemsPerPage={10}
                                    pages={2500}
                                />
                            }
                        />
                    </GridItem>
                </Grid>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        policyTableRows: state.PolicyReducer.policiesList.items.map(
            (policy) => {
                return ({ cells: [policy.attributes.name, policy.attributes.ref_id] });
            }
        )
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchData: () => dispatch(fetchPolicies())
    };
};

CompliancePoliciesTable.propTypes = {
    history: propTypes.object,
    policiesList: propTypes.array,
    policyTableRows: propTypes.array,
    fetchData: propTypes.func
};

export default routerParams(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CompliancePoliciesTable)
);;
