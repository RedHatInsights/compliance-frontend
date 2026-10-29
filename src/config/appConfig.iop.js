import IopSystemDetailsLink from 'PresentationalComponents/SystemDetailsLink/IopSystemDetailsLink';
import { withForemanCsrf } from '@/iop/foremanCsrf';

const appConfigIop = Object.freeze({
  envTarget: 'iop',
  features: Object.freeze({
    unleash: false,
    pdf: false,
    remediations: false,
    dashboardZeroState: false,
    inventoryGroupsAndTags: false,
  }),
  api: Object.freeze({
    complianceBasePath: '/insights_cloud/api/compliance/v2',
    inventoryBasePath: '/insights_cloud/api/inventory/v1',
  }),
  systemDetailsLink: IopSystemDetailsLink,
  requestInterceptors: Object.freeze([withForemanCsrf]),
  routes: Object.freeze({
    systemPermissions: Object.freeze(['compliance:report:read']),
    systemsPermissions: Object.freeze(['compliance:policy:read']),
  }),
});

export function getAppConfigIop() {
  return appConfigIop;
}
