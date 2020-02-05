import React, { useState } from 'react';
import propTypes from 'prop-types';
import { COMPLIANCE_API_ROOT } from '../../constants';
import { connect } from 'react-redux';
import { Dropdown, KebabToggle, DropdownItem, Tooltip } from '@patternfly/react-core';
import { exportToCSV } from '../../store/ActionTypes.js';

export const DownloadTableButton = ({ selectedEntities, exportToCSV }) => {
    const [isOpen, setOpen] = useState(false);

    const toggleButton = <KebabToggle
        onToggle={(value) => setOpen(value)}
        style={{ color: 'var(--pf-global--icon--Color--light)' }}
    />;

    const downloadLink = (format) => {
        return (selectedEntities !== null) ?
            COMPLIANCE_API_ROOT + '/systems.' + format +
            '?search=(id ^ (' + selectedEntities.join(',') + '))' : '';
    };

    const content = <div>More actions</div>;

    const dropdownItems = [
        <DropdownItem key='csv' onClick={ exportToCSV }>
            Export as CSV
        </DropdownItem>,
        <DropdownItem target='_blank' key='json' href={ downloadLink('json') }>
            Export as JSON
        </DropdownItem>
    ];

    return <Tooltip enableFlip={ true } content={ content }>
        <Dropdown
            onSelect={ () => setOpen(!isOpen) }
            isPlain
            toggle={ toggleButton }
            isOpen={ isOpen }
            dropdownItems={ dropdownItems } />
    </Tooltip>;
};

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
