import { useNavigate } from 'react-router-dom';

import { resolveComplianceRouterTo } from '../../../routing/compliancePaths.iop';

/**
 * IoP build: react-router navigation with IoP path mapping.
 */
const useComplianceNavigate = () => {
  const navigate = useNavigate();

  return (to) => navigate(resolveComplianceRouterTo(to));
};

export default useComplianceNavigate;
