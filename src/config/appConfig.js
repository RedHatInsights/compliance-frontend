import { getAppConfigHcc } from './appConfig.hcc';
import { getAppConfigIop } from './appConfig.iop';

export function getAppConfig() {
  if (process.env.IOP === 'true') {
    return getAppConfigIop();
  }

  return getAppConfigHcc();
}
