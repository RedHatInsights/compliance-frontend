import useQuery, { apiInstance } from '../useQuery';

const useSupportedProfiles = (selectedOsMajorVersion, skip) => {
  const { data, error, loading } = useQuery(apiInstance.supportedProfiles, {
    skip,
    ...(selectedOsMajorVersion !== undefined
      ? {
          params: [
            undefined,
            undefined,
            undefined,
            undefined,
            `os_major_version=${selectedOsMajorVersion}`,
          ],
        }
      : {}),
  });

  return { data: data?.data, error, loading };
};

export default useSupportedProfiles;
