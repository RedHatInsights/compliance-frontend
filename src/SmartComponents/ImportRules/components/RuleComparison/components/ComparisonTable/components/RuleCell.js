import React from 'react';
import propTypes from 'prop-types';

const RuleCell = ({ title, identifier }) => (
  <>
    {identifier?.label && `${identifier.label}: `}
    {title}
  </>
);

RuleCell.propTypes = {
  title: propTypes.string,
  identifier: propTypes.object,
};

export default RuleCell;
