import { createContext, useContext } from 'react';

export const IopChromeContext = createContext({
  permissionsEpoch: 0,
  chromeReady: false,
});

export const useIopChromeContext = () => useContext(IopChromeContext);
