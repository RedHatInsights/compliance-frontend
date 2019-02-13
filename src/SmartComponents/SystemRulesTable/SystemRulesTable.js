import React from 'react';
import propTypes from 'prop-types';
import ComplianceRemediationButton from '../ComplianceRemediationButton/ComplianceRemediationButton';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { Ansible, Input, Pagination, routerParams } from '@red-hat-insights/insights-frontend-components';
import { Table, TableHeader, TableBody, sortable, SortByDirection } from '@patternfly/react-table';
import { SearchIcon } from '@patternfly/react-icons';
import { Checkbox, Grid, GridItem } from '@patternfly/react-core';

const FAILED_COLOR = '#a30000';
const PASSED_COLOR = '#92d400';
const COMPLIANT_COLUMN = 3;

class SystemRulesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Rule', transforms: [sortable] },
                { title: 'Policy', transforms: [sortable] },
                { title: 'Severity', transforms: [sortable] },
                { title: 'Passed', transforms: [sortable] },
                { title: 'Remediation' }
            ],
            page: 1,
            itemsPerPage: 10,
            rows: [],
            currentRows: [],
            refIds: {},
            sortBy: {}
        };
        const rowsRefIds = this.rulesToRows(this.props.profileRules);
        this.state.rows = rowsRefIds.rows;
        this.state.refIds = rowsRefIds.refIds;
        this.currentRows(1, 10).then((rows) => {
            this.state.currentRows = rows;
        });
        this.onCollapse = this.onCollapse.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setPerPage = this.setPerPage.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onSort = this.onSort.bind(this);
        this.hidePassed = this.hidePassed.bind(this);
    }

    setPage(page) {
        this.currentRows(page, this.state.itemsPerPage).then((currentRows) => {
            this.setState(() => (
                {
                    page,
                    currentRows
                }
            ));
        });
    }

    setPerPage(itemsPerPage) {
        this.currentRows(this.state.page, itemsPerPage).then((currentRows) => {
            this.setState(() => (
                {
                    itemsPerPage,
                    currentRows
                }
            ));
        });
    }

    currentRows(page, itemsPerPage, providedRows) {
        const allRows = !providedRows ? this.state.rows : providedRows;
        let newRows = allRows.slice(
            (page - 1) * itemsPerPage * 2,
            page * itemsPerPage * 2);
        newRows = newRows.map((row) => {
            if (row.hasOwnProperty('parent') && row.parent > itemsPerPage) {
                row.parent = row.parent % (itemsPerPage * 2);
            }

            return row;
        });
        const ruleIds = newRows.map((row) => {
            if (row.hasOwnProperty('isOpen')) { return this.state.refIds[row.cells[0]]; }
        }).filter(rule => rule).map(rule => 'compliance:' + rule);

        return window.insights.chrome.auth.getUser()
        .then(() => {
            return fetch('/r/insights/platform/remediations/v1/resolutions', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ issues: ruleIds })
            }).then((response) => {
                if (!response.ok) {
                    // If remediations doesn't respond, inject no fix available
                    return {};
                }

                return response.json();
            });
        }).then(response => {
            newRows = newRows.map((row) => {
                if (row.hasOwnProperty('isOpen') && row.cells.length === 4) {
                    if (response['compliance:' + this.state.refIds[row.cells[0]]]) {
                        row.cells.push(<Ansible/>);
                    } else {
                        row.cells.push(<Ansible unsupported />);
                    }
                }

                return row;
            });

            return newRows;
        });
    }

    onSelect(_event, selected, key) {
        let { rows, page, itemsPerPage } = this.state;
        if (key === -1) {
            // This represents "Select all rules"
            const lowerBound = (page - 1) * itemsPerPage * 2;
            Array.from(new Array(itemsPerPage * 2), (x, i) => { rows[i + lowerBound].selected = selected; });
        } else {
            // One rule was selected
            rows[((page - 1) * itemsPerPage * 2) + Number(key)].selected = selected;
        }

        this.setState({ rows });
    }

    rulesToRows(profileRules) {
        const rows = [];
        const refIds = {};
        profileRules.forEach((profileRule) => (
            profileRule.rules.forEach((rule, i) => {
                refIds[rule.title] = rule.ref_id;
                rows.push({
                    isOpen: false,
                    cells: [
                        rule.title,
                        profileRule.profile,
                        rule.severity,
                        (rule.compliant ? <CheckCircleIcon style={{ color: PASSED_COLOR }}/> :
                            <ExclamationCircleIcon style={{ color: FAILED_COLOR }}/>)
                    ]
                });
                rows.push({
                    parent: i * 2,
                    cells: [
                        {
                            title: <React.Fragment key={i}>
                                <div id='rule-description'>
                                    <b>Description</b>
                                    <br/>
                                    <p>{rule.description}</p>
                                </div>
                                <br/>
                                <div id='rule-rationale'>
                                    <b>Rationale</b>
                                    <br/>
                                    <p>{rule.rationale}</p>
                                </div>
                            </React.Fragment>,
                            colSpan: 6
                        }
                    ]
                });
            })
        ));
        return { rows, refIds };
    }

    onCollapse(_event, rowKey, isOpen) {
        const { rows } = this.state;
        const key = ((this.state.page - 1) * this.state.itemsPerPage * 2) + Number(rowKey);
        rows[key].isOpen = isOpen;
        this.currentRows(this.state.page, this.state.itemsPerPage, rows).then((currentRows) => {
            this.setState(() => ({ rows, currentRows }));
        });
    }

    selectedRules() {
        return this.state.rows.filter(row => row.selected).map(row => this.state.refIds[row.cells[0]]);
    }

    // This takes both the row and its children (collapsible rows) and puts them into
    // one element. It is used only so that the rows can be compared.
    compressRows(rows) {
        const compressedRows = [];
        rows.forEach((row, i) => {
            if (row.hasOwnProperty('isOpen')) {
                compressedRows.push({ parent: row, child: rows[i + 1] });
            }
        });

        return compressedRows;
    }

    uncompressRows(compressedRows) {
        const originalRows = [];
        compressedRows.forEach((compressedRow, i) => {
            originalRows.push(compressedRow.parent);
            if (compressedRow.child) {
                let child = compressedRow.child;
                child.parent = i * 2;
                originalRows.push(child);
            }
        });
        return originalRows;
    }

    onSort(_event, index, direction) {
        // Original index is not the right column, as patternfly adds 1 because
        // of the 'collapsible' button and 1 because of the checkbox.
        let column = index - 2;
        const sortedRows = this.uncompressRows(
            this.compressRows(this.state.rows).sort(
                (a, b) => {
                    if (direction === SortByDirection.asc) {
                        if (column === COMPLIANT_COLUMN) {
                            return a.parent.cells[column].props.style.color === b.parent.cells[column].props.style.color ? 0 :
                                a.parent.cells[column].props.style.color < b.parent.cells[column].props.style.color ? 1 : -1;
                        } else {
                            return a.parent.cells[column].localeCompare(b.parent.cells[column]);
                        }

                    } else {
                        if (column === COMPLIANT_COLUMN) {
                            return a.parent.cells[column].props.style.color === b.parent.cells[column].props.style.color ? 0 :
                                a.parent.cells[column].props.style.color > b.parent.cells[column].props.style.color ? 1 : -1;
                        } else {
                            return -a.parent.cells[column].localeCompare(b.parent.cells[column]);
                        }
                    }
                }
            )
        );
        this.currentRows(this.state.page, this.state.itemsPerPage).then((currentRows) => {
            this.setState(() => ({
                currentRows,
                sortBy: {
                    index,
                    direction
                },
                rows: sortedRows
            }));
        });
    }

    hidePassed(checked) {
        if (checked) {
            const { rows } = this.state;
            const onlyPassedRows = [];
            this.state.rows.forEach((row, i) => {
                if (row.hasOwnProperty('isOpen') && row.cells[COMPLIANT_COLUMN].props.style.color === FAILED_COLOR) {
                    onlyPassedRows.push(row);
                    if (!rows[i + 1].hasOwnProperty('isOpen')) {
                        let child = rows[i + 1];
                        child.parent = onlyPassedRows.length - 1;
                        onlyPassedRows.push(child);
                    }
                }
            });

            this.currentRows(this.state.page, this.state.itemsPerPage, onlyPassedRows).then((currentRows) => {
                this.setState(() => ({
                    currentRows,
                    originalRows: rows,
                    rows: onlyPassedRows
                }));
            });
        } else {
            this.currentRows(this.state.page, this.state.itemsPerPage, this.state.originalRows).then((currentRows) => {
                this.setState(() => ({
                    currentRows,
                    rows: this.state.originalRows
                }));
            });
        }
    }

    render() {
        const { sortBy, currentRows, columns, rows, page, itemsPerPage } = this.state;

        return (
            <React.Fragment>
                <Grid gutter="sm">
                    <GridItem span={8}>
                        <Input
                            id="search"
                            type="text"
                            style={{ width: '200px' }}
                        />{' '}
                        <SearchIcon style={{ paddingTop: '4px' }} />
                    </GridItem>
                    <GridItem span={2}>
                        <Checkbox onChange={this.hidePassed} label={'Hide Passed Rules'} />
                    </GridItem>
                    <GridItem span={2}>
                        <ComplianceRemediationButton selectedRules={this.selectedRules()} />
                    </GridItem>

                    <GridItem span={12}>
                        <Table
                            cells={columns}
                            onCollapse={this.onCollapse}
                            onSort={this.onSort}
                            sortBy={sortBy}
                            onSelect={this.onSelect}
                            rows={currentRows}>
                            <TableHeader />
                            <TableBody />
                        </Table>
                        <Pagination
                            numberOfItems={rows.length}
                            onPerPageSelect={this.setPerPage}
                            page={page}
                            onSetPage={this.setPage}
                            itemsPerPage={itemsPerPage}
                        />
                    </GridItem>
                </Grid>
            </React.Fragment>
        );
    }
}

SystemRulesTable.propTypes = {
    profileRules: propTypes.array
};

export default routerParams(SystemRulesTable);
