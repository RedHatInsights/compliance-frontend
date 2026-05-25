import { useNavigate } from 'react-router-dom';

import { resolveComplianceRouterTo } from '@/Utilities/routing/compliancePaths.iop';

const useComplianceNavigate = () => {
  const navigate = useNavigate();

  return (to) => navigate(resolveComplianceRouterTo(to));
};

export default useComplianceNavigate;
