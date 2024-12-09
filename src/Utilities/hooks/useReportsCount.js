import useReportsQuery from './api/useReports';

const useReportsCount = () => {
  const query = useReportsQuery({
    params: { limit: 1, filter: 'with_reported_systems=true' },
  });

  return query?.data?.meta?.total ?? null;
};

export default useReportsCount;
