import React from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_API_ROOT } from '../../constants';
import { connect } from 'react-redux';
import { DownloadIcon } from '@patternfly/react-icons';
import { Dropdown, DropdownToggle, DropdownItem } from '@patternfly/react-core';

class DownloadTableButton extends React.Component {
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
            <DropdownItem key='csv' href={this.downloadLink('csv')}>
                CSV
            </DropdownItem>,
            <DropdownItem target='_blank' key='json' href={this.downloadLink('json')}>
                JSON
            </DropdownItem>
        ];
        return (
            <React.Fragment>
                <Dropdown
                    onSelect={this.onSelect}
                    toggle={<DropdownToggle onToggle={this.onToggle}><DownloadIcon/></DropdownToggle>}
                    isOpen={isOpen}
                    dropdownItems={dropdownItems}
                />
            </React.Fragment>
        );
    }
}

DownloadTableButton.propTypes = {
    selectedEntities: propTypes.array
};

const mapStateToProps = state => {
    if (state.entities === undefined || state.entities.entities === undefined) {
        return { selectedEntities: [] };
    }

    return {
        selectedEntities: state.entities.entities.
        filter(entity => entity.selected).
        map(entity => entity.id)
    };
};

export default connect(mapStateToProps)(DownloadTableButton);
