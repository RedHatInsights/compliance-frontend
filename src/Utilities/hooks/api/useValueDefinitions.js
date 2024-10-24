import useComplianceQuery from './useComplianceQuery';

const useValueDefinitions = (options) =>
  useComplianceQuery('valueDefinitions', options);

export default useValueDefinitions;
