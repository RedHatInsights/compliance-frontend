import React from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_API_ROOT } from '../../constants';
import { connect } from 'react-redux';
import { Dropdown, KebabToggle, DropdownItem, Tooltip } from '@patternfly/react-core';

class DownloadTableButton extends React.Component {
    state = {
        isOpen: false
    };

    onToggle = (isOpen) => {
        this.setState({
            isOpen
        });
    };

    onSelect = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    downloadLink = (format) => {
        const { selectedEntities, columns } = this.props;
        let link = '';
        const requestedColumns = columns.map(column => column.title);

        if (selectedEntities !== null) {
            link = COMPLIANCE_API_ROOT + '/systems.' + format + '?search=(id ^ (' +
                selectedEntities.join(',') + '))' + '&columns=' + requestedColumns.join(',');
        }

        return link;
    }

    render = () => {
        const { isOpen } = this.state;
        const dropdownItems = [
            <DropdownItem key='csv' href={this.downloadLink('csv')}>
                Export as CSV
            </DropdownItem>,
            <DropdownItem target='_blank' key='json' href={this.downloadLink('json')}>
                Export as JSON
            </DropdownItem>
        ];

        return (
            <React.Fragment>
                <Tooltip
                    enableFlip={ true }
                    content={
                        <div>
                            More actions
                        </div>
                    }
                >
                    <Dropdown
                        onSelect={this.onSelect}
                        toggle={<KebabToggle
                            onToggle={this.onToggle}
                            style={{ color: 'var(--pf-global--icon--Color--light)' }}
                        />}
                        isOpen={isOpen}
                        dropdownItems={dropdownItems}
                    />
                </Tooltip>
            </React.Fragment>
        );
    }
}

DownloadTableButton.propTypes = {
    selectedEntities: propTypes.array,
    columns: propTypes.array
};

const mapStateToProps = state => {
    if (state.entities === undefined || state.entities.rows === undefined) {
        return { selectedEntities: [] };
    }

    return {
        selectedEntities: state.entities.rows.
        filter(entity => entity.selected).
        map(entity => entity.id)
    };
};

export default connect(mapStateToProps)(DownloadTableButton);
