import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { BackgroundLink, LinkButton } from 'PresentationalComponents';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

class EditSystemsButtonToolbarItem extends React.Component {
  render() {
    const { systems } = this.props;
    return (
      <React.Fragment>
        <BackgroundLink
          to={`/scappolicies/${systems}/edit`}
          state={{ systems }}
          variant="primary"
          ouiaId="EditSystemsButton"
          component={LinkButton}
        >
          Edit systems
        </BackgroundLink>
      </React.Fragment>
    );
  }
}
/*
EditSystemsButtonToolbarItem.propTypes = {
};
 */
EditSystemsButtonToolbarItem.defaultProps = {
  allSystems: [],
};

export default connect(
  () => ({}),
  (dispatch) => ({
    addNotification: (notification) => dispatch(addNotification(notification)),
  })
)(EditSystemsButtonToolbarItem);
