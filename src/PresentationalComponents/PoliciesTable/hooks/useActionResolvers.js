import { useLocation, useNavigate } from 'react-router-dom';
import useRoutePermissions from 'Utilities/hooks/useRoutePermissions';

const useActionResolver = (policies) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { hasAccess: hasDeleteAccess, isLoading: isDeleteAccessLoading } =
    useRoutePermissions(`/scappolicies/XYZ/delete`);
  const { hasAccess: hasEditAccess, isLoading: isEditAccessLoading } =
    useRoutePermissions(`/scappolicies/XYZ/edit`);

  const onClick = (to, { itemId: policyId }) => {
    const policy = policies.find((policy) => policy.id === policyId);

    navigate(to, {
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
        onClick(
          `/insights/compliance/scappolicies/${policy.itemId}/delete`,
          policy
        ),
    },
    {
      title: 'Edit policy',
      isDisabled: !isEditAccessLoading && !hasEditAccess,
      onClick: (_event, _index, policy) =>
        onClick(
          `/insights/compliance/scappolicies/${policy.itemId}/edit`,
          policy
        ),
    },
  ];
};

export default useActionResolver;
