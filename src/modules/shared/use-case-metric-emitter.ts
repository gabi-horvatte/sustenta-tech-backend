import { logger } from '../../logger';

export function useCaseMetricEmitter() {
  return function <T extends (...args: any[]) => any>(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (this: any, ...args: any[]) {
      logger.info(`Executing use case`, {
        'use.case.name': this.constructor.name,
        'use.case.method': propertyKey.toString(),
        'use.case.input': args,
      });
      
      const result = await originalMethod.apply(this, args);
      
      logger.info(`Use case executed successfully`, {
        'use.case.name': this.constructor.name,
        'use.case.method': propertyKey.toString(),
      });
      
      return result;
    };
    
    return descriptor;
  };
}