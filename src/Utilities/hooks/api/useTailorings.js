import useQuery, { apiInstance } from '../useQuery';

export const useTailoring = (id) =>
  useQuery(apiInstance.tailorings, { params: [id] });

export const useTailorings = ({ params }) =>
  useQuery(apiInstance.tailorings, { params });
