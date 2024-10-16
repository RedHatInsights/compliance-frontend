import React from 'react';
import propTypes from 'prop-types';
import { Spinner } from '@patternfly/react-core';
import RuleDetailsRow from '../RuleDetailsRow';
import { useRule } from 'Utilities/hooks/api/useRule';

const RuleDetailsRowRest = ({
  item: rule,
  securityGuideId,
  onValueChange,
  onRuleValueReset,
}) => {
  const { data, loading } = useRule(securityGuideId, rule.itemId);
  const item = {
    ...rule,
    ...(data?.data || {}),
  };

  return loading ? (
    <Spinner />
  ) : (
    <RuleDetailsRow {...{ item, onValueChange, onRuleValueReset }} />
  );
};

RuleDetailsRowRest.propTypes = {
  item: propTypes.object,
  securityGuideId: propTypes.string,
  onValueChange: propTypes.func,
  onRuleValueReset: propTypes.func,
};

export default RuleDetailsRowRest;
