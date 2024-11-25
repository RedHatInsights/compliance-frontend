import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import useRoutePermissions from 'Utilities/hooks/useRoutePermissions';
import useAPIV2FeatureFlag from '../../../Utilities/hooks/useAPIV2FeatureFlag';

const useActionResolver = () => {
  const navigate = useNavigate();
  const apiV2Enabled = useAPIV2FeatureFlag();

  const { hasAccess: hasDeleteAccess, isLoading: isDeleteAccessLoading } =
    useRoutePermissions(`/scappolicies/XYZ/delete`);
  const { hasAccess: hasEditAccess, isLoading: isEditAccessLoading } =
    useRoutePermissions(`/scappolicies/XYZ/edit`);

  return () => [
    {
      title: 'Delete policy',
      isDisabled: !isDeleteAccessLoading && !hasDeleteAccess,
      onClick: (_event, _index, policy) =>
        navigate(`/scappolicies/${policy.itemId}/delete`),
    },
    {
      title: 'Edit policy',
      ...(apiV2Enabled
        ? {
            isAriaDisabled: true,
            tooltipProps: {
              content:
                'Switch to the stable version to access this functionality',
            },
          }
        : {
            isDisabled: !isEditAccessLoading && !hasEditAccess,
            onClick: (_event, _index, policy) =>
              navigate(`/scappolicies/${policy.itemId}/edit`),
          }),
    },
  ];
};

export default useActionResolver;
