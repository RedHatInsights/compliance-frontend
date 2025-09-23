import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core';

import { useTableState } from 'bastilian-tabletools';

const DifferingOnlyToggle = () => {
  const [differingOnly, setDifferingOnly] = useTableState('diffOnly', false);

  return (
    <ToggleGroup aria-label="Default with single selectable">
      <ToggleGroupItem
        text="All"
        isSelected={!differingOnly}
        onChange={() => setDifferingOnly(false)}
      />
      <ToggleGroupItem
        text="Differing only"
        isSelected={differingOnly}
        onChange={() => setDifferingOnly(true)}
      />
    </ToggleGroup>
  );
};

export default DifferingOnlyToggle;
