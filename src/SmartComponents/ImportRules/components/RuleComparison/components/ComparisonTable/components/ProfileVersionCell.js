import React from 'react';
import { Checkbox } from '@patternfly/react-core';

const ProfileVersionCell = ({
  columnOsVersion,
  columnSsgVersion,
  isDisabled,
  ...yolo
}) => {
  console.log(columnOsVersion, columnSsgVersion, yolo);
  return (
    <>
      <Checkbox isChecked isDisabled={isDisabled} />
    </>
  );
};

export default ProfileVersionCell;
