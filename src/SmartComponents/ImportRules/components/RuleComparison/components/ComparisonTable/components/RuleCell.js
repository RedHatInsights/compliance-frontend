import React from 'react';

const RuleCell = ({ title, identifier: { label } }) => (
  <>
    {label}: {title}
  </>
);

export default RuleCell;
