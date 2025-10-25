import { logger } from '../../logger';

export function useCaseMetricEmitter() {
  return function <T extends (...args: any[]) => any>(
    target: T,
    context: ClassMethodDecoratorContext<any, T>
  ) {
    return async function (this: any, ...args: any[]) {
      logger.info(`Executing use case`, {
        'use.case.name': context.name.toString(),
        'use.case.input': args,
      });
      const result = await target.apply(this, args);
      logger.info(`Use case executed successfully`, {
        'use.case.name': context.name.toString(),
      });
      return result;
    } as T;
  };
}