import React, { useId, useCallback } from 'react';
import propTypes from 'prop-types';

import { Checkbox } from '@patternfly/react-core';

const ProfileVersionCell = ({
  version,
  targetVersion,
  isDisabled,
  available_in_version,
  ref_id,
  selectedProp,

  onSelect,
  ...props
}) => {
  const id = useId();
  const onChange = useCallback(() => onSelect?.(ref_id), [onSelect, ref_id]);

  return (
    <>
      {available_in_version.includes(version.ssg_version) && (
        <Checkbox
          id={id}
          isChecked={props[selectedProp] || false}
          isDisabled={isDisabled}
          onChange={onChange}
        />
      )}
    </>
  );
};

ProfileVersionCell.propTypes = {
  sourceVersion: propTypes.object,
  targetVersion: propTypes.object,
  version: propTypes.string,
  targetVersion: propTypes.object,
  isDisabled: propTypes.bool,
  available_in_version: propTypes.array,
  ref_id: propTypes.string,
  selectedProp: propTypes.string,
  onSelect: propTypes.func,
};

export default ProfileVersionCell;
