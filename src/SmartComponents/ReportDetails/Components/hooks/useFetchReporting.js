import { processTestResultsData } from 'SmartComponents/ReportDetails/constants';
import { apiInstance } from 'Utilities/hooks/useQuery';
import { useCallback, useState } from 'react';

const useFetchReporting = (reportId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);

  const fetch = useCallback(
    async (page, perPage, combinedVariables) => {
      setIsLoading(true);
      const response = await apiInstance
        .reportTestResults(
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
            data: processTestResultsData(data),
            meta,
          };
        })
        .catch((e) => {
          console.log(e);
        });

      const res = {
        ...response,
        data: response.data.map((item) => {
          return {
            ...item,
            testResultProfiles: [
              { ...item, benchmark: { version: item.version } },
            ],
          };
        }),
      };

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
export default useFetchReporting;
