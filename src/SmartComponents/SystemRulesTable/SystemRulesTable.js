import React from 'react';
import propTypes from 'prop-types';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { Table, Input, routerParams } from '@red-hat-insights/insights-frontend-components';
import { SearchIcon } from '@patternfly/react-icons';
import { Grid, GridItem } from '@patternfly/react-core';

class SystemRulesTable extends React.Component {
    constructor(props) {
        super(props);
        const rows = [
            {
                children: [1], // row index
                isActive: false, // bool to change if children rows are expanded or not
                cells: ['1-1', '1-2', '1-3', '1-4']
            },
            {
                isOpen: false, // bool to indicate if this row is expanded
                cells: [{ title: 'This text will span across whole table.', colSpan: 4 }]
            },
            {
                children: [1], // row index
                isActive: false, // bool to change if children rows are expanded or not
                cells: ['3-1', '3-2', '3-3', '3-4']
            }
        ];
        rows.length;

        this.state = {
            openNodes: [],
            rows: this.rulesToRows(this.props.profileRules)
        };

        this.onExpandClick = this.onExpandClick.bind(this);

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
        this.rulesToRows(this.props.profileRules);
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
                            rows={this.state.rows.map((oneRow, key) => {
                                if (!oneRow.hasOwnProperty('isOpen')) {
                                    return oneRow;
                                }

                                oneRow.isOpen = this.state.openNodes.indexOf(key) !== -1;
                                return oneRow;
                            })}
                            expandable={true}
                            onExpandClick={this.onExpandClick}
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
