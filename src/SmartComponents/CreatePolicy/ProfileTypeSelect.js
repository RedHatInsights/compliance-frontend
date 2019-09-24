import React from 'react';
import {
    Table,
    TableHeader,
    TableBody
} from '@patternfly/react-table';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

class ProfileTypeSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Profile type name' },
                { title: 'Description' }
            ],
            rows: [
                {
                    cells: ['four', 'five']
                },
                {
                    cells: ['four', 'five']
                }
            ]
        };
        this.onSelect = this.onSelect.bind(this);
    }

    onSelect(event, isSelected, rowId) {
        let rows;
        if (rowId === -1) {
            rows = this.state.rows.map(oneRow => {
                oneRow.selected = isSelected;
                return oneRow;
            });
        } else {
            rows = [...this.state.rows];
            rows[rowId].selected = isSelected;
        }

        this.setState({
            rows
        });
    }

    render() {
        const { columns, rows } = this.state;

        return (
            <Table onSelect={this.onSelect} cells={columns} rows={rows}>
                <TableHeader />
                <TableBody />
            </Table>
        );
    }
}

export default connect(
    reduxForm({
        form: 'policyForm',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true
    })
)(ProfileTypeSelect);
