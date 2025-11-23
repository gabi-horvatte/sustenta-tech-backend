import ClassroomGateway from '@/modules/Classroom/datasource/Classroom/gateway.js';
import UseCase from "../../../../../shared/base-use-case.js";
import { Classroom } from '@/modules/Classroom/datasource/Classroom/model.js';

export default class ListAllClassrooms extends UseCase<void, Classroom[]> {
  constructor(private readonly classroomGateway: ClassroomGateway) {
    super();
  }

  async execute(): Promise<Classroom[]> {
    return this.classroomGateway.findAll();
  }
} 