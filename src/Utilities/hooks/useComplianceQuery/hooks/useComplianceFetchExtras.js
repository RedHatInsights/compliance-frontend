import { useCallback } from 'react';
import pAll from 'p-all';
import { isObject } from 'Utilities/helpers';

const CONCURRENT_QUEUE_REQUESTS = 2;

const useComplianceFetchExtras = ({ fetch, fetchBatched }) => {
  const exporter = useCallback(
    async (exporterParams) => (await fetchBatched(exporterParams)).data,
    [fetchBatched],
  );

  const fetchAllIds = useCallback(
    async (fetchAllIdsParams) =>
      (
        await fetchBatched({
          idsOnly: true,
          fetchAllIdsParams,
        })
      ).data.map(({ id }) => id),
    [fetchBatched],
  );

  const fetchNamedQueue = useCallback(
    async (queue) =>
      Object.fromEntries(
        await pAll(
          Object.entries(queue).map(([queueKey, params]) => async () => [
            queueKey,
            await fetch(params),
          ]),
          {
            concurrency: 1, // TODO make concurrent fetches possible
          },
        ),
      ),
    [fetch],
  );

  const fetchQueue = useCallback(
    async (queue) => {
      if (isObject(queue)) {
        return await fetchNamedQueue(queue);
      } else {
        return await pAll(
          queue.map((params) => async () => await fetch(params)),
          {
            concurrency: CONCURRENT_QUEUE_REQUESTS,
          },
        );
      }
    },
    [fetch, fetchNamedQueue],
  );

  const fetchBatchedNamedQueue = useCallback(
    async (queue) =>
      Object.fromEntries(
        await pAll(
          Object.entries(queue).map(([queueKey, params]) => async () => [
            queueKey,
            await fetchBatched(params),
          ]),
          {
            concurrency: 1, // TODO make batch concurrent fetches possible
          },
        ),
      ),
    [fetchBatched],
  );

  const fetchBatchedQueue = useCallback(
    async (queue) => {
      if (isObject(queue)) {
        return await fetchBatchedNamedQueue(queue);
      } else {
        return await pAll(
          queue.map((params) => async () => await fetchBatched(params)),
          {
            concurrency: 1, // TODO make batch concurrent fetches possible
          },
        );
      }
    },
    [fetchBatched, fetchBatchedNamedQueue],
  );

  return {
    exporter,
    fetchAllIds,
    fetchQueue,
    fetchBatchedQueue,
  };
};

export default useComplianceFetchExtras;
