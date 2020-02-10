import React from 'react';
import propTypes from 'prop-types';
import { EmptyTable, SimpleTableFilter, TableToolbar } from '@redhat-cloud-services/frontend-components';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import {
    Bullseye,
    EmptyState,
    EmptyStateBody,
    EmptyStateVariant,
    InputGroup,
    Level,
    LevelItem,
    Pagination,
    PaginationVariant,
    Title
} from '@patternfly/react-core';
import CreatePolicy from '../CreatePolicy/CreatePolicy';
import DeletePolicy from '../DeletePolicy/DeletePolicy';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import { paths } from '../../Routes';
import debounce from 'lodash/debounce';

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

export class PoliciesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Policy name' },
                { title: 'Operating system' },
                { title: 'Systems' },
                { title: 'Business objective' },
                { title: 'Compliance threshold' }
            ],
            page: 1,
            itemsPerPage: 10,
            search: '',
            rows: [],
            currentRows: [],
            isDeleteModalOpen: false,
            policyToDelete: {}
        };
    }

    componentDidMount = () => {
        this.setInitialCurrentRows();
    }

    componentDidUpdate = (prevProps) => {
        const { policies } = this.props;
        if (policies !== prevProps.policies) {
            this.setInitialCurrentRows();
        }
    }

    setInitialCurrentRows = () => {
        const { policies } = this.props;
        const { itemsPerPage } = this.state;
        const policyRows = this.policiesToRows(policies);

        this.setState({
            currentRows: policyRows.slice(0, itemsPerPage),
            rows: policyRows,
            allRows: policyRows
        });
    }

    policiesToRows = (policies) => {
        return policies.map((policy) => {
            return {
                cells: [
                    policy.name,
                    `RHEL ${policy.majorOsVersion}`,
                    policy.totalHostCount,
                    policy.businessObjective && policy.businessObjective.title || '--',
                    `${policy.complianceThreshold}%`
                ]
            };
        });
    }

    currentRows = (page, itemsPerPage, policyRows) => {
        const { rows } = (policyRows) ? policyRows : this.state;

        if (!rows.length) {
            return [];
        }

        if (rows.length < itemsPerPage) { itemsPerPage = rows.length; }

        const firstIndex = (page - 1) * itemsPerPage;
        const lastIndex = page * itemsPerPage;
        const newRows = rows.slice(firstIndex, lastIndex);

        return newRows;
    }

    setPage = (_event, page) => {
        const { itemsPerPage } = this.state;
        this.changePage(page, itemsPerPage);
    }

    setPerPage = (_event, itemsPerPage) => {
        const { page } = this.state;
        this.changePage(page, itemsPerPage);
    }

    changePage = (page, itemsPerPage) => {
        this.setState({
            currentRows: this.currentRows(page, itemsPerPage),
            page,
            itemsPerPage
        });
    }

    handleSearch = debounce(search => {
        const { itemsPerPage, allRows } = this.state;
        const filteredRows = allRows.filter(row => row.cells[0].match(search));
        this.setState({
            search,
            page: 1,
            rows: filteredRows,
            currentRows: filteredRows.slice(0, itemsPerPage)
        });
    }, 500)

    actionResolver = (rowData) => {
        const { history, policies } = this.props;

        return [
            {
                title: 'View latest results',
                onClick: (event, rowId) => history.push(`${paths.compliancePolicies}/${policies[rowId].id}`)
            },
            {
                title: 'Delete policy',
                onClick: () => {
                    this.setState((prev) => ({
                        policyToDelete: policies[rowData.id],
                        isDeleteModalOpen: !prev.isDeleteModalOpen
                    }));
                }
            }
        ];
    }

    render() {
        const { onWizardFinish } = this.props;
        const { rows, currentRows, columns, page, itemsPerPage, policyToDelete, isDeleteModalOpen } = this.state;
        return (
            <React.Fragment>
                <DeletePolicy
                    isModalOpen={isDeleteModalOpen}
                    policy={policyToDelete}
                    onDelete={onWizardFinish}
                    toggle={() => this.setState((prev) => ({ isDeleteModalOpen: !prev.isDeleteModalOpen }))}
                />
                <TableToolbar>
                    <Level gutter='md'>
                        <LevelItem>
                            <InputGroup>
                                <SimpleTableFilter buttonTitle={ null }
                                    onFilterChange={ this.handleSearch }
                                    placeholder="Search" />
                            </InputGroup>
                        </LevelItem>
                        <LevelItem>
                            { rows.length } results
                        </LevelItem>
                        <LevelItem>
                            <CreatePolicy onWizardFinish={onWizardFinish} />
                        </LevelItem>
                    </Level>
                    <Pagination
                        page={ page }
                        itemCount={ rows.length }
                        dropDirection='down'
                        onSetPage={ this.setPage }
                        onPerPageSelect={ this.setPerPage }
                        perPage={ itemsPerPage }
                    />
                </TableToolbar>
                <Table
                    aria-label='policies'
                    className='compliance-policies-table'
                    cells={ columns }
                    actionResolver={this.actionResolver}
                    rows={ (currentRows.length === 0) ? emptyRows : currentRows }>
                    <TableHeader />
                    <TableBody />
                </Table>
                <TableToolbar isFooter className="ins-c-inventory__table--toolbar">
                    <Pagination
                        page={ page }
                        itemCount={ rows.length }
                        dropDirection='up'
                        onSetPage={ this.setPage }
                        onPerPageSelect={ this.setPerPage }
                        perPage={ itemsPerPage }
                        variant={ PaginationVariant.bottom }
                    />
                </TableToolbar>
            </React.Fragment>
        );
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

export default routerParams(PoliciesTable);
