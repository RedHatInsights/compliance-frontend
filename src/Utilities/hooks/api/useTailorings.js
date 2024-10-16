import useQuery, { apiInstance } from '../useQuery';

export const useTailoring = (id) =>
  useQuery(apiInstance.tailorings, { params: [id] });

export const useTailorings = (options) =>
  useQuery(apiInstance.tailorings, options);
