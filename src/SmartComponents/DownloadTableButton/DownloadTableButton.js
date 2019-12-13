import React from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_API_ROOT } from '../../constants';
import { connect } from 'react-redux';
import { Dropdown, KebabToggle, DropdownItem, Tooltip } from '@patternfly/react-core';
import { exportToCSV } from '../../store/ActionTypes.js';

export class DownloadTableButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
        this.onToggle = this.onToggle.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    onToggle(isOpen) {
        this.setState({
            isOpen
        });
    };

    onSelect() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    downloadLink(format) {
        let link = '';
        if (this.props !== null && this.props.selectedEntities !== null) {
            link = COMPLIANCE_API_ROOT + '/systems.' + format + '?search=(id ^ (' +
                this.props.selectedEntities.join(',') + '))';
        }

        return link;
    }

    render() {
        const { isOpen } = this.state;
        const dropdownItems = [
            <DropdownItem key='csv' onClick={ this.props.exportToCSV }>
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
                        isPlain
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
    exportToCSV: propTypes.func
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

const mapDispatchToProps = dispatch => {
    return {
        exportToCSV: event => dispatch(exportToCSV(event))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadTableButton);
