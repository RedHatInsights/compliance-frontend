import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useDeepCompareEffect } from 'use-deep-compare';
import debounce from '@redhat-cloud-services/frontend-components-utilities/debounce';
import useFilterConfig from '@/Frameworks/AsyncTableTools/hooks/useFilterConfig';
import { filtersSerialiser } from 'PresentationalComponents/ComplianceTable/serialisers';
import * as filters from '../Filters';

const useSystemsFilterConfig = ({
  filters: { policies, ssgVersions, compliant, severity },
  inventory,
}) => {
  const dispatch = useDispatch();
  const filterConfig = useMemo(
    () => [
      filters.name,
      ...(policies?.length ? [filters.policies(policies)] : []),
      ...(ssgVersions?.length ? [filters.ssgVersions(ssgVersions)] : []),
      ...(compliant ? [filters.compliant, filters.complianceScore] : []),
      ...(severity ? [filters.severity] : []),
    ],
    [ssgVersions, policies, compliant, severity],
  );
  const filterConfigReturn = useFilterConfig({
    serialisers: { filters: filtersSerialiser },
    filters: {
      filterConfig,
    },
  });

  // Filters do not yet trigger the inventory to call getEntities
  // and the page would not reset to page 1
  // The debounce is to not have filter updates collide or get out of order.
  const debounceResetPage = debounce(() => {
    Promise.resolve(
      dispatch({
        type: 'RESET_PAGE',
      }),
    ).then(() => inventory?.current?.onRefreshData());
  }, 150);

  useDeepCompareEffect(() => {
    debounceResetPage();
  }, [filterConfigReturn.activeFilters]);

  return filterConfigReturn;
};

export default useSystemsFilterConfig;
