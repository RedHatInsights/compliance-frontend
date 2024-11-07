export const policyRulesSkips = ({
  tableState,
  profileId,
  securityGuideId,
}) => {
  const { tableView, ['open-items']: openItems } = tableState?.tableState || {};

  return {
    rules:
      !tableState ||
      !securityGuideId ||
      !profileId ||
      (tableView === 'tree' && !openItems?.length === 0),
    ruleTree:
      !tableState || !securityGuideId || !profileId || tableView === 'rows',
    ruleGroups: !tableState || tableView === 'rows',
  };
};
