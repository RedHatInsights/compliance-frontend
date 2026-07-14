import useUnleashFlagsReadyHcc from './useUnleashFlagsReady.hcc';
import useUnleashFlagsReadyIop from './useUnleashFlagsReady.iop';

export default process.env.IOP === 'true'
  ? useUnleashFlagsReadyIop
  : useUnleashFlagsReadyHcc;
