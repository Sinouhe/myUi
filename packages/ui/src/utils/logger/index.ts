// Utils
import { isNode } from '../isomorph';

// Constants
import { loggerKeys } from './constants';

// Type
import type { LoggerType } from './type';

const logger = (
  message: any = '',
  { method = 'info', objectToLog, key, forceLog = false }: LoggerType = {
    key: loggerKeys.all,
  },
): void => {
  try {
    // No log on node side.
    if (isNode) return;

    // In case we do not force log, we have to check if user requested for this type of logs.
    if (!forceLog) {
      const { localStorage: { fshKeyLog } = { fshKeyLog: '' } } = window;
      if (fshKeyLog !== loggerKeys.all && fshKeyLog !== key) return;
    }
    if (!message) {
      // eslint-disable-next-line no-console
      console.error('no message for logger.');
      return;
    }
    let methodToLog: any = () => null;
    switch (method) {
      case 'debug':
        // eslint-disable-next-line no-console
        methodToLog = console.debug;
        break;
      case 'error':
        // eslint-disable-next-line no-console
        methodToLog = console.error;
        break;
      case 'info':
        // eslint-disable-next-line no-console
        methodToLog = console.log;
        break;
      case 'trace':
        // eslint-disable-next-line no-console
        methodToLog = console.trace;
        break;
      case 'warn':
        // eslint-disable-next-line no-console
        methodToLog = console.warn;
        break;
      default:
        // eslint-disable-next-line no-console
        methodToLog = console.log;
    }

    if (methodToLog) methodToLog(typeof message === 'function' ? message() : message);
    if (objectToLog && methodToLog) methodToLog(objectToLog);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
};

export default logger;
