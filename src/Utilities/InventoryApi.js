import { HostsApi } from '@redhat-cloud-services/host-inventory-client';
import instance from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';
import { INVENTORY_API_ROOT } from '../constants';
export const hosts = new HostsApi(undefined, INVENTORY_API_ROOT, instance);
export const getSystemProfile = (hostId) => hosts.apiHostGetHostSystemProfileById([hostId]);
