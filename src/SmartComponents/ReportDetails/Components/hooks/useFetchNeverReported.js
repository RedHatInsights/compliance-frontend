import { processSystemsData } from 'SmartComponents/ReportDetails/constants';
import { apiInstance } from 'Utilities/hooks/useQuery';
import { useCallback, useState } from 'react';

const useFetchNeverReported = (reportId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);

  const fetch = useCallback(
    async (page, perPage, combinedVariables) => {
      setIsLoading(true);
      const res = await apiInstance
        .reportSystems(
          reportId,
          undefined,
          combinedVariables.tags,
          perPage,
          page,
          false,
          combinedVariables.sortBy,
          combinedVariables.filter
        )
        .then(({ data: { data = [], meta = {} } = {} } = {}) => {
          return {
            data: processSystemsData(data),
            meta,
          };
        })
        .catch((e) => {
          console.log(e);
        });

      setData(res);
      setIsLoading(false);

      return res;
    },
    [reportId]
  );

  return {
    isLoading,
    fetch,
    data,
  };
};
export default useFetchNeverReported;
