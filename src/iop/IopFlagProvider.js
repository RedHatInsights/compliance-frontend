import React, { useMemo } from 'react';
import { FlagContext } from '@unleash/proxy-client-react';

import { staticUnleashFlagProviderConfig } from '@/config/staticUnleashFlagProviderConfig';

const staticFlags = Object.fromEntries(
  staticUnleashFlagProviderConfig.bootstrap.map(({ name, enabled }) => [
    name,
    enabled,
  ]),
);

const defaultVariant = { name: 'disabled', enabled: false };

const noop = () => undefined;

/**
 * IoP has no Unleash server. FlagProvider still calls client.start() unless a
 * custom client is passed, which triggers fetch to config.url (localhost).
 * This provider stubs FlagContext with bootstrap values only.
 *  @param root0
 *  @param root0.children
 */
const IopFlagProvider = ({ children }) => {
  const value = useMemo(
    () => ({
      flagsReady: true,
      flagsError: null,
      setFlagsReady: noop,
      setFlagsError: noop,
      isEnabled: (flag) => staticFlags[flag] ?? false,
      getVariant: (flag) => {
        const toggle = staticUnleashFlagProviderConfig.bootstrap.find(
          ({ name }) => name === flag,
        );
        return toggle?.variant ?? defaultVariant;
      },
      on: noop,
      updateContext: async () => undefined,
      client: {
        getAllToggles: () => staticUnleashFlagProviderConfig.bootstrap,
        on: noop,
        off: noop,
        isEnabled: (flag) => staticFlags[flag] ?? false,
        getVariant: (flag) => {
          const toggle = staticUnleashFlagProviderConfig.bootstrap.find(
            ({ name }) => name === flag,
          );
          return toggle?.variant ?? defaultVariant;
        },
      },
    }),
    [],
  );

  return <FlagContext.Provider value={value}>{children}</FlagContext.Provider>;
};

export default IopFlagProvider;
