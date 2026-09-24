import { useNavigate } from 'react-router-dom';

const normalizePath = (to) => {
  if (typeof to === 'string') {
    return to.startsWith('/') ? to : `/${to}`;
  }

  if (to?.pathname) {
    const pathname = to.pathname.startsWith('/')
      ? to.pathname
      : `/${to.pathname}`;
    return { ...to, pathname };
  }

  return to;
};

const useComplianceNavigate = () => {
  const navigate = useNavigate();

  return (to) => navigate(normalizePath(to));
};

export default useComplianceNavigate;
