import React from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_API_ROOT } from '../../constants';
import { connect } from 'react-redux';
import { DownloadIcon } from '@patternfly/react-icons';

class DownloadTableButton extends React.Component {
    downloadLink() {
        let link = '';
        if (this.props !== null && this.props.selectedEntities !== null) {
            link = COMPLIANCE_API_ROOT + '/systems.csv?search=(id ^ (' +
                this.props.selectedEntities.join(',') + '))';
        }

        return link;

    }

    render() {
        return (
            <a href={this.downloadLink()} ><DownloadIcon /></a>
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
