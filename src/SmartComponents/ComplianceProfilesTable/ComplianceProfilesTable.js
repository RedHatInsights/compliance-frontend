import React from 'react';
import { Table, Pagination, Input, SortDirection, routerParams } from '@red-hat-insights/insights-frontend-components';
import { connect } from 'react-redux';
import { fetchProfiles } from '../../store/Actions/ProfileActions';
import propTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

class ComplianceProfilesTable extends React.Component {
    constructor(props) {
        super(props);
        this.sort = this.sort.bind(this);
        this.filter = this.filter.bind(this);
        this.state = {
            profilesList: [],
            filterValue: '',
            sortBy: {
                index: '',
                direction: SortDirection.up
            }
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state.profilesList === undefined || (state.profilesList.length === 0 && state.filterValue === '')) {
            return { ...state, profilesList: props.profilesList };
        }

        return {};
    }

    componentDidMount() {
        this.props.fetchData();
    }

    filter(value) {
        let filtered = this.props.profileTableRows.filter(item => item.synopsis.indexOf(value) !== -1);
        this.setState({ ...this.state, profileList: filtered, filterValue: value }, () =>
            this.sort(this.state.sortBy.index, this.state.sortBy.direction)
        );
    }

    sort(key, value) {
        let sorted = this.state.profileList;
        let direction = value === SortDirection.down ? 'desc' : 'asc';
        this.setState({ ...this.state, profilesList: sorted, sortBy: { index: key, direction } });
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
                            rows={this.props.profileTableRows}
                            onRowClick={(event, key) => this.handleRedirect(key)}
                            onSort={(event, key, value) => this.sort(key, value)}
                            sortBy={this.state.sortBy}
                            footer={
                                <Pagination
                                    numberOfItems={
                                        this.state.filterValue === '' || this.state.profilesList.length === 11
                                            ? 1
                                            : this.state.profilesList.length
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
        profileTableRows: state.ProfileReducer.profilesList.items.map(
            (profile) => {
                return ({ cells: [profile.attributes.name, profile.attributes.ref_id] });
            }
        )
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchData: () => dispatch(fetchProfiles())
    };
};

ComplianceProfilesTable.propTypes = {
    history: propTypes.object,
    profilesList: propTypes.array,
    profileTableRows: propTypes.array,
    fetchData: propTypes.func
};

export default routerParams(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ComplianceProfilesTable)
);
