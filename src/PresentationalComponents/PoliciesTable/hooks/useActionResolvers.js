import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

const useActionResolver = ({ deletePermission, editPermission }) => {
  const navigate = useNavigate();

  const { hasAccess: hasDeleteAccess, isLoading: isDeleteAccessLoading } =
    deletePermission;
  const { hasAccess: hasEditAccess, isLoading: isEditAccessLoading } =
    editPermission;

  return () => [
    {
      title: 'Delete policy',
      isDisabled: !isDeleteAccessLoading && !hasDeleteAccess,
      onClick: (_event, _index, { item }) =>
        navigate(`/scappolicies/${item.itemId}/delete`),
    },
    {
      title: 'Edit policy',
      isDisabled: !isEditAccessLoading && !hasEditAccess,
      onClick: (_event, _index, { item }) =>
        navigate(`/scappolicies/${item.itemId}/edit`),
    },
  ];
};

export default useActionResolver;
