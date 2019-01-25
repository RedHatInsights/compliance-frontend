import React from 'react';
import propTypes from 'prop-types';
import ComplianceRemediationButton from '../ComplianceRemediationButton/ComplianceRemediationButton';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { Ansible, Table, Input, Pagination, routerParams } from '@red-hat-insights/insights-frontend-components';
import { SearchIcon } from '@patternfly/react-icons';
import { Grid, GridItem, Text, TextVariants } from '@patternfly/react-core';

class SystemRulesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openNodes: [],
            page: 1,
            itemsPerPage: 10,
            rows: this.rulesToRows(this.props.profileRules),
            currentRows: []
        };
        this.currentRows(1, 10).then((rows) => {
            this.state.currentRows = rows;
        });
        this.onExpandClick = this.onExpandClick.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setPerPage = this.setPerPage.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
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
        const ruleIds = newRows.map((row) => {
            if (row.cells.length === 5) { return row.cells[1]; }
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
                if (row.cells.length === 5) {
                    if (response['compliance:' + row.cells[1]]) {
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

    onItemSelect(_event, key, selected) {
        let { rows, page, itemsPerPage } = this.state;
        rows[((page - 1) * itemsPerPage * 2) + Number(key)].selected = selected;
        this.setState({
            rows
        });
    }

    rulesToRows(profileRules) {
        const rows = [];
        profileRules.forEach((profileRule) => (
            profileRule.rules.forEach((rule, i) => {
                rows.push({
                    children: [i * 2 + 1],
                    cells: [
                        <Text key={i} component={TextVariants.a}>{rule.title}</Text>,
                        rule.ref_id,
                        profileRule.profile,
                        rule.severity,
                        (rule.compliant ? <CheckCircleIcon style={{ color: '#92d400' }}/> :
                            <ExclamationCircleIcon style={{ color: '#a30000' }}/>)
                    ]
                });
                rows.push({
                    isOpen: false,
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
                            colSpan: 5
                        }
                    ]
                });
            })
        ));
        return rows;
    }

    onExpandClick(_event, row, rowKey) {
        const key = ((this.state.page - 1) * this.state.itemsPerPage * 2) + Number(rowKey);
        const activeRow = this.state.rows[key];
        const isActive = !activeRow.active;
        let openNodes = this.state.openNodes;
        activeRow.active = isActive;
        if (!isActive) {
            activeRow.children.forEach(oneChild => {
                openNodes.splice(openNodes.indexOf(oneChild), 1);
            });
        } else {
            openNodes = [
                ...openNodes,
                ...row.children
            ];
        }

        this.setState({
            openNodes,
            rows: this.state.rows
        });
    }

    selectedRules() {
        return this.state.rows.filter(row => row.selected).map(row => row.cells[1]);
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
                            variant='large'
                            header={['Rule', 'Reference ID', 'Policy', 'Severity', 'Passed', 'Remediation']}
                            hasCheckbox
                            onItemSelect={this.onItemSelect}
                            rows={this.state.currentRows.map((oneRow, key) => {
                                if (!oneRow.hasOwnProperty('isOpen')) {
                                    return oneRow;
                                }

                                const rowKey = ((this.state.page - 1) * this.state.itemsPerPage * 2) + Number(key);
                                oneRow.isOpen = this.state.openNodes.indexOf(rowKey) !== -1;
                                return oneRow;
                            })}
                            expandable={true}
                            onExpandClick={this.onExpandClick}
                            footer={<Pagination
                                numberOfItems={this.state.rows.length}
                                onPerPageSelect={ this.setPerPage }
                                page={ this.state.page }
                                onSetPage={ this.setPage }
                                itemsPerPage={ this.state.itemsPerPage }
                            />}
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
