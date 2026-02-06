import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { APIFactory } from '@redhat-cloud-services/javascript-clients-shared';
import listWorkspaces from '@redhat-cloud-services/rbac-client/v2/WorkspacesList';
import { useAxiosWithPlatformInterceptors } from '@redhat-cloud-services/frontend-components-utilities/interceptors';
import { RBAC_API_BASE_V2 } from '@/constants';


export const useKesselWorkspaces = (options = {}) => {
  const axios = useAxiosWithPlatformInterceptors();
  const rbacClient = useMemo(
    () => APIFactory(RBAC_API_BASE_V2, { workspacesList: listWorkspaces }, axios),
    [axios]
  );

  return useQuery({
    queryKey: ['workspaces', options.type],
    queryFn: async () => {
      const response = await rbacClient.workspacesList({
        limit: options.limit ?? 1000,
        offset: 0,
        type: options.type ?? 'all',
        name: options.name,
      });
      return response?.data?.data ?? [];
    },
    enabled: options.enabled ?? true,
    staleTime: 5 * 60 * 1000, // TODO: check if it's a good option nere
  });
};

export const useFetchDefaultWorkspaceId = () => {
  const {
    data: workspaces,
    isLoading,
    error,
  } = useKesselWorkspaces({ type: 'default', limit: 1 });
  const defaultWorkspace = workspaces?.[0];

  return {
    workspaceId: defaultWorkspace?.id,
    isLoading,
    error,
  };
};
