import { useCaseMetricEmitter } from "./use-case-metric-emitter";

export default class UseCase<Input, Output> {

  constructor() { }

  @useCaseMetricEmitter()
  execute(_input: Input): Promise<Output | void> {
    throw new Error("Method not implemented.");
  }
}