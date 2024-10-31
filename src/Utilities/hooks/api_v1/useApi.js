import ApiClient from './utils/ApiClient';

const useApi = (options) => {
  const apiClient = new ApiClient({
    ...options,
  });

  return apiClient;
};

export default useApi;
