import React from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_API_ROOT } from '../../constants';
import { connect } from 'react-redux';
import { DownloadIcon } from '@patternfly/react-icons';
import { Dropdown, DropdownItem } from '@red-hat-insights/insights-frontend-components';

class DownloadTableButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        };

        this.onToggle = this.onToggle.bind(this);
    }

    onToggle() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    downloadLink(format) {
        let link = '';
        if (this.props !== null && this.props.selectedEntities !== null) {
            link = COMPLIANCE_API_ROOT + '/systems.' + format + '?search=(id ^ (' +
                this.props.selectedEntities.join(',') + '))';
        }

        return link;
    }

    render() {
        return (
            <React.Fragment>
                <Dropdown
                    title={ <DownloadIcon/> }
                    isCollapsed={this.state.collapsed}
                    onToggle={this.onToggle}
                >
                    <DropdownItem target='_blank' href={this.downloadLink('csv')}>CSV</DropdownItem>
                    <DropdownItem target='_blank' href={this.downloadLink('json')}>JSON</DropdownItem>
                </Dropdown>
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
