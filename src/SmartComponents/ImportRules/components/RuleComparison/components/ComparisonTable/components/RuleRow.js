import React from 'react';
import { Tr } from '@patternfly/react-table';

// background: var(--Greyscale---pf-v5-global--palette--black-150, #F5F5F5);
//background: var(--Blue---pf-v5-global--palette--blue-50, #E7F1FA);

// color: var(--pf-v6-global--danger-color--100);

const RuleRow = ({
  children,
  row: {
    item: { isNew, isDeprecated },
  },
  rowProps: _rowProps,
  ...props
}) => {
  return (
    <Tr
      {...props}
      style={{
        ...(isDeprecated
          ? { backgroundColor: 'var(--pf-v5-global--palette--black-150)' }
          : {}),
        ...(isNew
          ? { backgroundColor: 'var(--pf-v5-global--palette--blue-50)' }
          : {}),
      }}
    >
      {children}
    </Tr>
  );
};

export default RuleRow;
