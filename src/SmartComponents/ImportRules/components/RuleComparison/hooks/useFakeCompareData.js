// import { useFullTableState } from 'bastilian-tabletools';
import useTailoringRules from 'Utilities/hooks/api/useTailoringRules';

const useFakeCompareData = ({ tailoringId, policyId }) => {
  // const fullTableState = useFullTableState();
  // const { tableState: { diffOnly } = {} } = fullTableState || {};

  // TODO Replace with actual comparison endpoint(s)
  const { data, error, loading } = useTailoringRules({
    params: {
      tailoringId,
      policyId,
      // diffOnly
    },
    useTableState: true,
    skip: !tailoringId || !policyId,
  });

  return {
    loading,
    data,
    error,
  };
};

export default useFakeCompareData;
