import React from 'react';
import propTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import {
    Bullseye, Button, EmptyState, EmptyStateBody, EmptyStateVariant, Pagination, PaginationVariant, Title,
    ToolbarItem, Tooltip
} from '@patternfly/react-core';
import { EmptyTable, PrimaryToolbar, TableToolbar } from '@redhat-cloud-services/frontend-components';
import { FilterConfigBuilder } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components';

import {
    BackgroundLink,
    SystemsCountWarning
} from 'PresentationalComponents';

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
            policyId: policy.id,
            cells: [
                { title: <Link to={'/scappolicies/' + policy.id}>{policy.name}</Link>, original: policy.name },
                {
                    title: <Tooltip key={policy.id}
                        position='right'
                        content={
                            <span>SCAP Security Guide (SSG): {policy.benchmark.title} - {policy.benchmark.version}</span>
                        }
                    >
                        <span>
                            RHEL {policy.majorOsVersion} (SSG {policy.benchmark.version})
                        </span>
                    </Tooltip>
                },
                { title: policy.totalHostCount > 0 ? policy.totalHostCount :
                    <SystemsCountWarning count={ policy.totalHostCount } variant='count' /> },
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
        activeFilters: {}
    }

    setPage = (_event, page) => (
        this.changePage(page, this.state.itemsPerPage)
    )

    setPerPage = (_event, itemsPerPage) => (
        this.changePage(1, itemsPerPage)
    )

    changePage = (page, itemsPerPage) => (
        this.setState({
            page,
            itemsPerPage
        })
    )

    paginatedPolicies = (policies) => (
        policies.slice(
            (this.state.page - 1) * this.state.itemsPerPage,
            this.state.page * this.state.itemsPerPage
        )
    )

    filteredPolicies = () => (
        this.filterConfigBuilder.applyFilterToObjectArray(
            this.props.policies, this.state.activeFilters
        )
    )

    onFilterUpdate = (filter, value) => {
        this.setState({
            page: 1,
            activeFilters: {
                ...this.state.activeFilters,
                [filter]: value
            }
        });
    }

    deleteFilter = (chips) => {
        const activeFilters =  this.filterConfigBuilder.removeFilterWithChip(
            chips, this.state.activeFilters
        );
        this.setState({
            activeFilters
        });
    }

    clearAllFilter = () => (
        this.setState({
            activeFilters: this.filterConfigBuilder.initialDefaultState()
        })
    )

    onFilterDelete = (_event, chips, clearAll = false) => (
        clearAll ? this.clearAllFilter() : this.deleteFilter(chips[0])
    )

    actionResolver = () => ([
        {
            title: 'Delete policy',
            onClick: (_event, _index, { policyId }) => {
                const policy = this.props.policies.find((policy) => (
                    policy.id === policyId
                ));
                this.props.history.push(`/scappolicies/${ policyId }/delete`, {
                    policy,
                    background: this.props.location
                });
            }
        }
    ]);

    render() {
        const { page, itemsPerPage } = this.state;
        const policies = this.filteredPolicies();
        const filterChips = this.chipBuilder.chipsFor(this.state.activeFilters);
        const rows = policiesToRows(this.paginatedPolicies(policies));
        const filterConfig = this.filterConfigBuilder.buildConfiguration(
            this.onFilterUpdate,
            this.state.activeFilters,
            { hideLabel: true }
        );
        const pagination = {
            page,
            itemCount: policies.length,
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
                <ToolbarItem>
                    <BackgroundLink to='/scappolicies/new'>
                        <Button variant='primary'>Create new policy</Button>
                    </BackgroundLink>
                </ToolbarItem>
                <ToolbarItem>
                    { policies.length } results
                </ToolbarItem>
            </PrimaryToolbar>
            <Table
                aria-label='policies'
                className='compliance-policies-table'
                cells={ this.columns }
                actionResolver={ rows.length > 0 && this.actionResolver }
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
        </React.Fragment>;
    }
}

PoliciesTable.propTypes = {
    policies: propTypes.array.isRequired,
    history: propTypes.object.isRequired,
    location: propTypes.object.isRequired
};

PoliciesTable.defaultProps = {
    policies: []
};

export { policiesToRows };

export default withRouter(PoliciesTable);
