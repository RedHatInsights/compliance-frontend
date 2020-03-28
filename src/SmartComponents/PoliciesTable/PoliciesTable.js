import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import {
    Bullseye, EmptyState, EmptyStateBody, EmptyStateVariant, Pagination, PaginationVariant, Title,
    DataToolbarItem
} from '@patternfly/react-core';
import { EmptyTable, PrimaryToolbar, TableToolbar } from '@redhat-cloud-services/frontend-components';
import { FilterConfigBuilder } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components';
import CreatePolicy from '../CreatePolicy/CreatePolicy';
import DeletePolicy from '../DeletePolicy/DeletePolicy';
import { paths } from '../../Routes';
import { stringToId } from 'Utilities/TextHelper';

const emptyRows = [{
    cells: [{
        title: (
            <EmptyTable>
                <Bullseye>
                    <EmptyState variant={ EmptyStateVariant.full }>
                        <Title headingLevel="h5" size="lg">
                                No matching policies found
                        </Title>
                        <EmptyStateBody>
                                This filter criteria matches no policies. <br /> Try changing your filter settings.
                        </EmptyStateBody>
                    </EmptyState>
                </Bullseye>
            </EmptyTable>
        ),
        props: {
            colSpan: 5
        }
    }]
}];

const policiesToRows = (policies) => (
    policies.map((policy) => (
        {
            cells: [
                { title: <Link to={'/policies/' + policy.id}>{policy.name}</Link>, original: policy.name },
                `RHEL ${policy.majorOsVersion}`,
                policy.totalHostCount,
                policy.businessObjective && policy.businessObjective.title || '--',
                `${policy.complianceThreshold}%`
            ]
        }
    ))
);

const FILTER_CONFIGURATION = [
    {
        type: conditionalFilterType.text,
        label: 'Name',
        filter: (policies, value) => (
            policies.filter((policy) => policy.name.includes(value))
        )
    }
];

export class PoliciesTable extends React.Component {
    filterConfigBuilder = new FilterConfigBuilder(FILTER_CONFIGURATION);
    chipBuilder = this.filterConfigBuilder.getChipBuilder();
    filterBuilder = this.filterConfigBuilder.getFilterBuilder();
    columns = [
        { title: 'Policy name' },
        { title: 'Operating system' },
        { title: 'Systems' },
        { title: 'Business objective' },
        { title: 'Compliance threshold' }
    ]
    state = {
        page: 1,
        itemsPerPage: 10,
        rows: [],
        isDeleteModalOpen: false,
        policyToDelete: {},
        filterChips: [],
        activeFilters: {}
    }

    componentDidMount = () => (
        this.setInitialCurrentRows()
    )

    componentDidUpdate = (prevProps) => {
        if (this.props.policies !== prevProps.policies) {
            this.setInitialCurrentRows();
        }
    }

    setInitialCurrentRows = () => (
        this.setState({
            rows: policiesToRows(this.filteredPolicies())
        })
    )

    setPage = (_event, page) => (
        this.changePage(page, this.state.itemsPerPage)
    )

    setPerPage = (_event, itemsPerPage) => (
        this.changePage(this.state.page, itemsPerPage)
    )

    changePage = (page, itemsPerPage) => (
        this.setState({
            page,
            itemsPerPage,
            rows: policiesToRows(this.filteredPolicies())
        })
    )

    paginatedPolicies = (policies) => (
        policies.slice(
            (this.state.page - 1) * this.state.itemsPerPage,
            this.state.page * this.state.itemsPerPage
        )
    )

    filteredPolicies = () => (
        this.paginatedPolicies(this.filterConfigBuilder.applyFilterToObjectArray(
            this.props.policies, this.state.activeFilters
        ))
    )

    updateChips = () => (
        this.chipBuilder.chipsFor(this.state.activeFilters).then((filterChips) => (
            this.setState({
                filterChips
            })
        ))
    )

    updateRows = () => (
        this.setState({
            rows: policiesToRows(this.filteredPolicies())
        })
    )

    updateTable = () => {
        this.updateRows();
        this.updateChips();
    }

    onFilterUpdate = (filter, value) => {
        this.setState({
            page: 1,
            activeFilters: {
                ...this.state.activeFilters,
                [filter]: value
            }
        }, this.updateTable);
    }

    removeFilterFromFilterState = (currentState, filter) => (
        (typeof(currentState) === 'string') ? '' :
            currentState.filter((value) =>
                value !== filter
            )
    )

    deleteFilter = (chips) => {
        const chipCategory = chips.category;
        const chipValue = this.filterConfigBuilder.valueForLabel(chips.chips[0].name, chipCategory);
        const stateProp = stringToId(chipCategory);
        const currentState = this.state.activeFilters[stateProp];
        const newFilterState = this.removeFilterFromFilterState(currentState, chipValue);
        const activeFilters =  {
            ...this.state.activeFilters,
            [stateProp]: newFilterState
        };

        this.setState({
            activeFilters
        }, this.updateTable);
    }

    clearAllFilter = () => (
        this.setState({
            activeFilters: this.filterConfigBuilder.initialDefaultState(),
            filterChips: []
        }, this.updateTable)
    )

    onFilterDelete = (_event, chips, clearAll = false) => (
        clearAll ? this.clearAllFilter() : this.deleteFilter(chips[0])
    )

    actionResolver = (rowData) => {
        const { history, policies } = this.props;
        const { itemsPerPage, page } = this.state;

        const currentRowIndex = rowData.id + (page - 1) * itemsPerPage;

        return [
            {
                title: 'View latest results',
                onClick: () => history.push(`${paths.compliancePolicies}/${policies[currentRowIndex].id}`)
            },
            {
                title: 'Delete policy',
                onClick: () => {
                    this.setState((prev) => ({
                        policyToDelete: policies[currentRowIndex],
                        isDeleteModalOpen: !prev.isDeleteModalOpen
                    }));
                }
            }
        ];
    }

    render() {
        const { onWizardFinish } = this.props;
        const {
            rows, page, itemsPerPage, policyToDelete, isDeleteModalOpen, filterChips
        } = this.state;
        const filterConfig = this.filterConfigBuilder.buildConfiguration(
            this.onFilterUpdate,
            this.state.activeFilters,
            { hideLabel: true }
        );
        const pagination = {
            page,
            itemCount: rows.length,
            dropDirection: 'down',
            onSetPage: this.setPage,
            onPerPageSelect: this.setPerPage,
            perPage: itemsPerPage
        };

        return <React.Fragment>
            <PrimaryToolbar
                filterConfig={ filterConfig }
                activeFiltersConfig={{
                    filters: filterChips,
                    onDelete: this.onFilterDelete
                }}
                pagination={{
                    ...pagination,
                    dropDirection: 'down'
                }}>
                <DataToolbarItem>
                    <CreatePolicy onWizardFinish={onWizardFinish} />
                </DataToolbarItem>
                <DataToolbarItem>
                    { rows.length } results
                </DataToolbarItem>
            </PrimaryToolbar>
            <Table
                aria-label='policies'
                className='compliance-policies-table'
                cells={ this.columns }
                actionResolver={this.actionResolver}
                rows={ (rows.length === 0) ? emptyRows : rows }>
                <TableHeader />
                <TableBody />
            </Table>
            <TableToolbar isFooter className="ins-c-inventory__table--toolbar">
                <Pagination
                    { ...pagination }
                    dropDirection='up'
                    variant={ PaginationVariant.bottom }
                />
            </TableToolbar>
            <DeletePolicy
                isModalOpen={isDeleteModalOpen}
                policy={policyToDelete}
                onDelete={onWizardFinish}
                toggle={() => this.setState((prev) => ({ isDeleteModalOpen: !prev.isDeleteModalOpen }))}
            />
        </React.Fragment>;
    }
}

PoliciesTable.propTypes = {
    policies: propTypes.array.isRequired,
    history: propTypes.object,
    onWizardFinish: propTypes.func
};

PoliciesTable.defaultProps = {
    policies: []
};

export { policiesToRows };

export default routerParams(PoliciesTable);
