import { useState } from 'react';
import { useLinkToBackground, useAnchor } from 'Utilities/Router';

export const useNewRulesAlertState = (...args) => useState(...args);
export const useLinkToPolicy = (address) => {
  const anchor = useAnchor();
  const linkToBackground = useLinkToBackground(`/scappolicies/${address}`);
  return () => {
    linkToBackground({ hash: anchor });
  };
};
