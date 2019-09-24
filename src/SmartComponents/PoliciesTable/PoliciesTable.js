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
import { RowLoader } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';
import CreatePolicy from '../CreatePolicy/CreatePolicy';

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

class PoliciesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Policy name' },
                { title: 'Policy type' },
                { title: 'Business initiative' },
                { title: 'Compliance threshold' }
            ],
            page: 1,
            itemsPerPage: 10,
            rows: [],
            currentRows: []
        };
    }

    render() {
        const { rows, currentRows, columns, page, itemsPerPage } = this.state;
        const { loading } = this.props;

        if (loading) {
            return (
                <Table
                    aria-label='policies-loading'
                    cells={ columns }
                    rows={ [...Array(5)].map(() => ({
                        cells: [{
                            title: <RowLoader />,
                            colSpan: 5
                        }]
                    })) }>
                    <TableHeader />
                    <TableBody />
                </Table>
            );
        } else {
            /* eslint-disable camelcase */
            return (
                <React.Fragment>
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
                                { rows.length / 2 } results
                            </LevelItem>
                            <LevelItem>
                                <CreatePolicy />
                            </LevelItem>
                        </Level>
                        <Pagination
                            page={ page }
                            itemCount={ rows.length / 2 }
                            dropDirection='down'
                            onSetPage={ this.setPage }
                            onPerPageSelect={ this.setPerPage }
                            perPage={ itemsPerPage }
                        />
                    </TableToolbar>
                    <Table
                        aria-label='policies'
                        className='compliance-profiles-table'
                        cells={ columns }
                        rows={ (currentRows.length === 0) ? emptyRows : currentRows }>
                        <TableHeader />
                        <TableBody />
                    </Table>
                    <TableToolbar isFooter className="ins-c-inventory__table--toolbar">
                        <Pagination
                            page={ page }
                            itemCount={ rows.length / 2 }
                            dropDirection='up'
                            onSetPage={ this.setPage }
                            onPerPageSelect={ this.setPerPage }
                            perPage={ itemsPerPage }
                            variant={ PaginationVariant.bottom }
                        />
                    </TableToolbar>
                </React.Fragment>
            );
            /* eslint-enable camelcase */
        }
    }
}

PoliciesTable.propTypes = {
    profiles: propTypes.array,
    loading: propTypes.bool,
    hidePassed: propTypes.bool,
    severity: propTypes.array,
    rows: propTypes.array
};

PoliciesTable.defaultProps = {
    profiles: []
};

export default PoliciesTable;
