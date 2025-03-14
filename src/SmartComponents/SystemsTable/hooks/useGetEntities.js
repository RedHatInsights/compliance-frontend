import { useCallback } from 'react';

const useGetEntities = (fetchEntities, { markEntitySelected } = {}) =>
  useCallback(
    async (_ids, inventoryState) => {
      const {
        data: entities,
        meta: { total },
      } = await fetchEntities(inventoryState);

      const results = (entities || [])
        .map((entity) => ({
          ...entity,
          item: { itemId: entity.id },
        }))
        .map(markEntitySelected);

      return {
        results,
        total,
      };
    },
    [fetchEntities, markEntitySelected]
  );

export default useGetEntities;
