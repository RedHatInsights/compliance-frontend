import { useHistory, useLocation } from 'react-router-dom';
import useRoutePermissions from 'Utilities/hooks/useRoutePermissions';

const useActionResolver = (policies) => {
  const history = useHistory();
  const location = useLocation();

  const { hasAccess: hasDeleteAccess, isLoading: isDeleteAccessLoading } =
    useRoutePermissions(`/scappolicies/XYZ/delete`);
  const { hasAccess: hasEditAccess, isLoading: isEditAccessLoading } =
    useRoutePermissions(`/scappolicies/XYZ/edit`);

  const onClick = (to, { itemId: policyId }) => {
    const policy = policies.find((policy) => policy.id === policyId);
    history.push(to, {
      policy,
      background: location,
      state: { policy },
    });
  };

  return () => [
    {
      title: 'Delete policy',
      isDisabled: !isDeleteAccessLoading && !hasDeleteAccess,
      onClick: (_event, _index, policy) =>
        onClick(`/scappolicies/${policy.itemId}/delete`, policy),
    },
    {
      title: 'Edit policy',
      isDisabled: !isEditAccessLoading && !hasEditAccess,
      onClick: (_event, _index, policy) =>
        onClick(`/scappolicies/${policy.itemId}/edit`, policy),
    },
  ];
};

export default useActionResolver;
