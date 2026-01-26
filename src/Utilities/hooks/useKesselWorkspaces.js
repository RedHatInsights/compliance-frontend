import { useQuery } from '@tanstack/react-query';

const RBAC_API_BASE_V2 = '/api/rbac/v2';

export const useKesselWorkspaces = (options = {}) => {
  return useQuery({
    queryKey: ['workspaces', options.type],
    queryFn: async () => {
      const response = await fetch(
        `${RBAC_API_BASE_V2}/workspaces/?limit=1000&type=${options.type ?? 'all'}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch workspaces');
      }
      const data = await response.json();
      return data.data || [];
    },
    enabled: options.enabled ?? true,
  });
};

export const useFetchDefaultWorkspaceId = () => {
  const {
    data: workspaces,
    isLoading,
    error,
  } = useKesselWorkspaces({ type: 'default' });
  const defaultWorkspace = workspaces?.[0];

  return {
    workspaceId: defaultWorkspace?.id,
    isLoading,
    error,
  };
};
