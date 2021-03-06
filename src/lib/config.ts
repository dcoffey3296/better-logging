import { DeepPartial, Record, useValueOrFallback } from '@olian/typescript-helpers';
import { FormattingContext } from './interfaces/formatting.context';
import { MessageConstructionStrategy } from './enums/messageConstructionStrategy';
import { Theme } from './interfaces/theme';
import { theme as defaultTheme } from '../themes/dark';

export class Config extends Record<Config> {
  public readonly messageConstructionStrategy!: MessageConstructionStrategy;
  public readonly format!: (ctx: FormattingContext) => string;
  public readonly saveToFile!: string | null;
  public readonly color!: Theme;
  public readonly logLevels!: {
    readonly debug: number;
    readonly log: number;
    readonly info: number;
    readonly line: number;
    readonly warn: number;
    readonly error: number;
  };
}

export type PartialConfig = DeepPartial<Config>;

export const DefaultConfig = new Config({
  messageConstructionStrategy: MessageConstructionStrategy.ALL,
  format: ctx => `${ctx.time24} ${ctx.type} ${ctx.msg}`,
  saveToFile: null,
  color: defaultTheme,
  logLevels: {
    debug: 4,
    log: 3,
    info: 2,
    line: 1,
    warn: 1,
    error: 0
  },
});

export const resolveConfig = (config: PartialConfig) => new Config({
  messageConstructionStrategy: useValueOrFallback(config, 'messageConstructionStrategy', DefaultConfig.messageConstructionStrategy),
  format: useValueOrFallback(config, 'format', DefaultConfig.format),
  saveToFile: useValueOrFallback(config, 'saveToFile', null),
  color: !config.color ?  DefaultConfig.color : {
    base: useValueOrFallback(config.color, 'base', DefaultConfig.color.base),
    type: !config.color.type ? DefaultConfig.color.type : {
      debug: useValueOrFallback(config.color.type, 'debug', DefaultConfig.color.type.debug),
      error: useValueOrFallback(config.color.type, 'error', DefaultConfig.color.type.error),
      info: useValueOrFallback(config.color.type, 'info', DefaultConfig.color.type.info),
      log: useValueOrFallback(config.color.type, 'log', DefaultConfig.color.type.log),
      warn: useValueOrFallback(config.color.type, 'warn', DefaultConfig.color.type.warn),
    }
  },
  logLevels: !config.logLevels ? DefaultConfig.logLevels : {
    debug: useValueOrFallback(config.logLevels, 'debug', DefaultConfig.logLevels.debug),
    error: useValueOrFallback(config.logLevels, 'error', DefaultConfig.logLevels.error),
    info: useValueOrFallback(config.logLevels, 'info', DefaultConfig.logLevels.info),
    log: useValueOrFallback(config.logLevels, 'log', DefaultConfig.logLevels.log),
    warn: useValueOrFallback(config.logLevels, 'warn', DefaultConfig.logLevels.warn),
    line: useValueOrFallback(config.logLevels, 'line', DefaultConfig.logLevels.line),
  }
});
