
import UseCase from "../../../../../shared/base-use-case.js";
import { ListClassroomStudentsInput, ListClassroomStudentsOutput } from "./dto.js";
import StudentGateway from '../../../../datasource/Student/gateway.js';
import AccountGateway from '@/modules/Authentication/datasource/Account/gateway.js';
import ClassroomTeacherGateway from '../../../../datasource/ClassroomTeacher/gateway.js';


export default class ListClassroomStudents extends UseCase<ListClassroomStudentsInput, ListClassroomStudentsOutput> {
  constructor(
    private readonly classroomTeacherGateway: ClassroomTeacherGateway,
    private readonly studentGateway: StudentGateway,
    private readonly accountGateway: AccountGateway,
  ) {
    super();
  }

  async execute(input: ListClassroomStudentsInput): Promise<ListClassroomStudentsOutput> {
    const classroomTeacher = await this.classroomTeacherGateway.findById({ classroom_id: input.classroom_id, teacher_id: input.teacher_id });

    if (!classroomTeacher)
      throw new Error('Teacher is not a classroom teacher');

    const students = await this.studentGateway.findByClassroomId({ classroomId: input.classroom_id });
    const accounts = await this.accountGateway.findByIds(students.map((student) => ({ id: student.id })));

    return students.map((student) => {
      const account = accounts.find((account) => account.id === student.id);

      if (!account) {
        throw new Error(`Account not found for student: ${student.id}`);
      }
      return {
        ...account,
        ...student,
      };
    });
  }
}



