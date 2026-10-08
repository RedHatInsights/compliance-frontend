import { staticUnleashFlagProviderConfig } from './staticUnleashFlagProviderConfig';

const iopStaticFlags = Object.fromEntries(
  staticUnleashFlagProviderConfig.bootstrap.map(({ name, enabled }) => [
    name,
    enabled,
  ]),
);

export function getIopStaticFeatureFlag(flag) {
  return iopStaticFlags[flag] ?? false;
}
