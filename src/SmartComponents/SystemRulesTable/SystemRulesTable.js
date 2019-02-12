import React from 'react';
import propTypes from 'prop-types';
import ComplianceRemediationButton from '../ComplianceRemediationButton/ComplianceRemediationButton';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { Ansible, Input, Pagination, routerParams } from '@red-hat-insights/insights-frontend-components';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { SearchIcon } from '@patternfly/react-icons';
import { Grid, GridItem } from '@patternfly/react-core';

class SystemRulesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openNodes: [],
            page: 1,
            itemsPerPage: 10,
            rows: [],
            currentRows: [],
            refIds: {}
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
    }

    setPage(page) {
        this.currentRows(page, this.state.itemsPerPage).then((rows) => {
            this.setState(() => (
                {
                    page,
                    currentRows: rows
                }
            ));
        });
    }

    setPerPage(itemsPerPage) {
        this.currentRows(this.state.page, itemsPerPage).then((rows) => {
            this.setState(() => (
                {
                    itemsPerPage,
                    currentRows: rows
                }
            ));
        });
    }

    currentRows(page, itemsPerPage) {
        let newRows = this.state.rows.slice(
            (page - 1) * itemsPerPage * 2,
            page * itemsPerPage * 2);
        newRows = newRows.map((row) => {
            if (row.hasOwnProperty('parent') && row.parent > itemsPerPage) {
                row.parent = row.parent % (itemsPerPage * 2);
            }

            return row;
        });
        const ruleIds = newRows.map((row) => {
            if (row.cells.length === 4) { return this.state.refIds[row.cells[0]]; }
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
                if (row.cells.length === 4) {
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
            Array.from(new Array(itemsPerPage), (x, i) => { rows[i + lowerBound].selected = selected; });
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
                        (rule.compliant ? <CheckCircleIcon style={{ color: '#92d400' }}/> :
                            <ExclamationCircleIcon style={{ color: '#a30000' }}/>)
                    ]
                });
                rows.push({
                    parent: [i * 2],
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
        this.setState(() => ({ rows }));
        this.currentRows(this.state.page, this.state.itemsPerPage).then((newRows) => {
            this.setState(() => ({ currentRows: newRows }));
        });
    }

    selectedRules() {
        return this.state.rows.filter(row => row.selected).map(row => this.state.refIds[row.cells[0]]);
    }

    render() {
        return (
            <React.Fragment>
                <Grid gutter="sm">
                    <GridItem span={10}>
                        <Input
                            id="search"
                            type="text"
                            style={{ width: '200px' }}
                        />{' '}
                        <SearchIcon style={{ paddingTop: '4px' }} />
                    </GridItem>
                    <GridItem span={2}>
                        <ComplianceRemediationButton selectedRules={this.selectedRules()} />
                    </GridItem>

                    <GridItem span={12}>
                        <Table
                            cells={['Rule', 'Policy', 'Severity', 'Passed', 'Remediation']}
                            onCollapse={this.onCollapse}
                            onSelect={this.onSelect}
                            rows={this.state.currentRows}>
                            <TableHeader />
                            <TableBody />
                        </Table>
                        <Pagination
                            numberOfItems={this.state.rows.length}
                            onPerPageSelect={ this.setPerPage }
                            page={ this.state.page }
                            onSetPage={ this.setPage }
                            itemsPerPage={ this.state.itemsPerPage }
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
