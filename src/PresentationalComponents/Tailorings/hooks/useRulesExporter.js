import { useCallback } from 'react';
import pMap from 'p-map';

const useRulesExporter = (fetchRules, { batchSize = 10 } = {}) => {
  const fetchExportData = useCallback(async () => {
    const firstPage = await fetchRules(0, batchSize);
    const total = firstPage?.meta?.total;

    if (total > batchSize) {
      const pages = Math.ceil(total / batchSize) || 1;

      const pagesParams = [...new Array(pages)]
        .map((_, pageIdx) => {
          const page = pageIdx;
          if (page >= 1) {
            const offset = page * batchSize;

            return [offset, batchSize];
          }
        })
        .filter((v) => !!v);
      const fetchPage = ([offset, limit]) => fetchRules(offset, limit);
      const result = await pMap(pagesParams, fetchPage, { concurrency: 2 });

      return [firstPage, ...result];
    } else {
      return [firstPage];
    }
  }, [fetchRules, batchSize]);

  const exporter = useCallback(
    async () => (await fetchExportData()).flatMap((result) => result.data),
    [fetchExportData]
  );

  return exporter;
};

export default useRulesExporter;
