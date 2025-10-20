type MethodType = 'trace' | 'debug' | 'info' | 'warn' | 'error';

export type LoggerType = {
  method?: MethodType;
  objectToLog?: any;
  key?: string;
  forceLog?: boolean;
};
