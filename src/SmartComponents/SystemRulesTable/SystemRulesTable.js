import React from 'react';
import propTypes from 'prop-types';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { Table, Input, Pagination, routerParams } from '@red-hat-insights/insights-frontend-components';
import { SearchIcon } from '@patternfly/react-icons';
import { Grid, GridItem } from '@patternfly/react-core';

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
        this.state.currentRows = this.currentRows(1, 10);
        this.onExpandClick = this.onExpandClick.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setPerPage = this.setPerPage.bind(this);
    }

    setPage(page) {
        this.setState(() => (
            {
                page,
                currentRows: this.currentRows(page, this.state.itemsPerPage)
            }
        ));
    }

    setPerPage(itemsPerPage) {
        this.setState(() => (
            {
                itemsPerPage,
                currentRows: this.currentRows(this.state.page, itemsPerPage)
            }
        ));
    }

    currentRows(page, itemsPerPage) {
        return this.state.rows.slice(
            (page - 1) * itemsPerPage * 2,
            page * itemsPerPage * 2
        );
    }

    rulesToRows(profileRules) {
        const rows = [];
        profileRules.forEach((profileRule) => (
            profileRule.rules.forEach((rule, i) => {
                rows.push({
                    children: [i * 2 + 1],
                    cells: [
                        rule.title,
                        profileRule.profile,
                        rule.severity,
                        (rule.compliant ? <CheckCircleIcon style={{ color: '#92d400' }}/> :
                            <ExclamationCircleIcon style={{ color: '#a30000' }}/>)
                    ]
                });
                rows.push({
                    isOpen: false,
                    cells: [
                        <React.Fragment key={i}>
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
                        </React.Fragment>
                    ]
                });
            })
        ));
        return rows;
    }

    onExpandClick(_event, row, rowKey) {
        const activeRow = this.state.rows[rowKey];
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

    render() {
        return (
            <React.Fragment>
                <Grid gutter="sm">
                    <GridItem span={3}>
                        <Input
                            id="search"
                            type="text"
                            style={{ width: '200px' }}
                        />{' '}
                        <SearchIcon style={{ paddingTop: '4px' }} />
                    </GridItem>

                    <GridItem span={12}>
                        <Table
                            header={['Title', 'Policy', 'Severity', 'Passed']}
                            rows={this.state.currentRows.map((oneRow, key) => {
                                if (!oneRow.hasOwnProperty('isOpen')) {
                                    return oneRow;
                                }

                                oneRow.isOpen = this.state.openNodes.indexOf(key) !== -1;
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
