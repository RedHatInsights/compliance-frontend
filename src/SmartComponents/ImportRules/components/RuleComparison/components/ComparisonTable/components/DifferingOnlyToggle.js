import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core';

import useTableState from '@/Frameworks/AsyncTableTools/hooks/useTableState';

const DifferingOnlyToggle = () => {
  const [differingOnly, setDifferingOnly] = useTableState(
    'differingOnly',
    true,
  );

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
