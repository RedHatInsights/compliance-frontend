import React from 'react';
import { Table, Pagination, Input, SortDirection, routerParams } from '@red-hat-insights/insights-frontend-components';
import { connect } from 'react-redux';
import { fetchSystems } from '../../store/Actions/SystemActions';
import propTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

class ComplianceSystemsTable extends React.Component {
    constructor(props) {
        super(props);
        this.sort = this.sort.bind(this);
        this.filter = this.filter.bind(this);
        this.state = {
            systemsList: [],
            filterValue: '',
            sortBy: {
                index: '',
                direction: SortDirection.up
            }
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state.systemsList === undefined || (state.systemsList.length === 0 && state.filterValue === '')) {
            return { ...state, systemsList: props.systemsList };
        }

        return {};
    }

    componentDidMount() {
        this.props.fetchData();
    }

    filter(value) {
        let filtered = this.props.systemTableRows.filter(item => item.synopsis.indexOf(value) !== -1);
        this.setState({ ...this.state, systemList: filtered, filterValue: value }, () =>
            this.sort(this.state.sortBy.index, this.state.sortBy.direction)
        );
    }

    sort(key, value) {
        let sorted = this.state.systemList;
        let direction = value === SortDirection.down ? 'desc' : 'asc';
        this.setState({ ...this.state, systemsList: sorted, sortBy: { index: key, direction } });
    }

    handleRedirect() {
        this.props.history.push('/systems/');
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
                            header={['Systems', 'Policies', 'Compliant']}
                            rows={this.props.systemTableRows}
                            onRowClick={(event, key) => this.handleRedirect(key)}
                            onSort={(event, key, value) => this.sort(key, value)}
                            sortBy={this.state.sortBy}
                            footer={
                                <Pagination
                                    numberOfItems={
                                        this.state.filterValue === '' || this.state.systemsList.length === 11
                                            ? 1
                                            : this.state.systemsList.length
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
        systemTableRows: state.SystemReducer.systemsList.items.map(
            (system) => {
                let profileRefIds = system.attributes.profiles.map((profile) => profile.ref_id).join(', ');
                return ({ cells: [system.attributes.name, profileRefIds] });
            }
        )
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchData: () => dispatch(fetchSystems())
    };
};

ComplianceSystemsTable.propTypes = {
    history: propTypes.object,
    systemsList: propTypes.array,
    systemTableRows: propTypes.array,
    fetchData: propTypes.func
};

export default routerParams(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ComplianceSystemsTable)
);
