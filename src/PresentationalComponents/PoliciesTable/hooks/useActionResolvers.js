import useNavigate from '@/Utilities/hooks/useComplianceNavigate';

const useActionResolver = ({ deletePermission = {}, editPermission = {} }) => {
  const navigate = useNavigate();
  const {
    hasAccess: hasEditAccess = false,
    isLoading: isEditAccessLoading = false,
  } = editPermission;

  const {
    hasAccess: hasDeleteAccess = false,
    isLoading: isDeleteAccessLoading = false,
  } = deletePermission;

  return () => [
    {
      title: 'Edit policy',
      isDisabled: !isEditAccessLoading && !hasEditAccess,
      onClick: (_event, _index, { item }) =>
        navigate(`/scappolicies/${item.itemId}/edit`),
    },
    {
      title: 'Delete policy',
      isDisabled: !isDeleteAccessLoading && !hasDeleteAccess,
      onClick: (_event, _index, { item }) =>
        navigate(`/scappolicies/${item.itemId}/delete`),
    },
  ];
};

export default useActionResolver;
