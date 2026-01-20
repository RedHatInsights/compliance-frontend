import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

const useActionResolver = ({ deletePermission = {}, editPermission = {} }) => {
  const navigate = useNavigate();

  const {
    hasAccess: hasDeleteAccess = false,
    isLoading: isDeleteAccessLoading = false,
  } = deletePermission;
  const {
    hasAccess: hasEditAccess = false,
    isLoading: isEditAccessLoading = false,
  } = editPermission;

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
