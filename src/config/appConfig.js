import { getAppConfigHcc } from './appConfig.hcc';
import { getAppConfigIop } from './appConfig.iop';

let isIop = null;

const foremanAppConfig = Object.freeze({
  ...getAppConfigIop(),
  // Add features that are available only in Foreman
});

export function setIopDeployment(iop) {
  isIop = iop !== false;
}

export function getAppConfig() {
  if (process.env.IOP === 'true') {
    return isIop ? getAppConfigIop() : foremanAppConfig;
  }

  return getAppConfigHcc();
}
