import { Router } from "express";
import CreateStudentController from "./student/create";
import CreateStudent from "../../application/use-cases/Manager/CreateStudent";
import StudentGateway from "../../datasource/Student/gateway";
import AccountGateway from "../../../Authentication/datasource/Account/gateway";
import CreateTeacherController from "./teacher/create";
import CreateTeacher from "../../application/use-cases/Manager/CreateTeacher";
import TeacherGateway from "../../datasource/Teacher/gateway";
import CreateClassroomController from "./classroom/create";
import CreateClassroom from "../../application/use-cases/Manager/CreateClassroom";
import ClassroomGateway from "../../datasource/Classroom/gateway";
import GetClassroomListController from "./classroom/list";
import GetClassroomList from "../../application/use-cases/Teacher/GetClassroomList";
import EditClassroomController from "./classroom/edit";
import EditClassroom from "../../application/use-cases/Manager/EditClassroom";
import DeleteClassroomController from "./classroom/delete";
import DeleteClassroom from "../../application/use-cases/Manager/DeleteClassroom";
import ListClassroomStudentsController from "./student/get-classroom-students";
import ListClassroomStudents from "../../application/use-cases/Teacher/ListClassroomStudents";
import ClassroomTeacherGateway from "../../datasource/ClassroomTeacher/gateway";
import { asyncHandler } from '@/server/utils/async-handler';
import GetClassroomController from "./classroom/get";
import GetClassroom from "../../application/use-cases/GetClassroom";
import GetStudentController from "./student/get";
import GetStudent from "../../application/use-cases/GetStudent";
import GetTeacherController from './teacher/get';
import GetTeacher from "../../application/use-cases/Teacher/GetTeacher";

export const setupClassroomRoutes = (router: Router) => {
  router.post("/student", asyncHandler(async (req, res, next) => {
    const studentGateway = new StudentGateway(req.dbClient);
    const accountGateway = new AccountGateway(req.dbClient);
    await new CreateStudentController(new CreateStudent(studentGateway, accountGateway)).handle(req, res);
  }));

  router.get("/student/:student_id", asyncHandler(async (req, res, next) => {
    const studentGateway = new StudentGateway(req.dbClient);
    await new GetStudentController(new GetStudent(studentGateway)).handle(req, res);
  }));

  router.get("/student", asyncHandler(async (req, res, next) => {
    const classroomTeacherGateway = new ClassroomTeacherGateway(req.dbClient);
    const studentGateway = new StudentGateway(req.dbClient);
    const accountGateway = new AccountGateway(req.dbClient);
    await new ListClassroomStudentsController(new ListClassroomStudents(classroomTeacherGateway, studentGateway, accountGateway)).handle(req, res);
  }));

  router.post("/teacher", asyncHandler(async (req, res, next) => {
    const teacherGateway = new TeacherGateway(req.dbClient);
    const accountGateway = new AccountGateway(req.dbClient);
    await new CreateTeacherController(new CreateTeacher(teacherGateway, accountGateway)).handle(req, res, next);
  }));

  router.get("/teacher/:teacher_id", asyncHandler(async (req, res, next) => {
    const teacherGateway = new TeacherGateway(req.dbClient);
    await new GetTeacherController(new GetTeacher(teacherGateway)).handle(req, res);
  }));

  router.post("/classroom", asyncHandler(async (req, res, next) => {
    const classroomGateway = new ClassroomGateway(req.dbClient);
    await new CreateClassroomController(new CreateClassroom(classroomGateway)).handle(req, res);
  }));

  router.get("/classroom", asyncHandler(async (req, res, next) => {
    const classroomGateway = new ClassroomGateway(req.dbClient);
    await new GetClassroomListController(new GetClassroomList(classroomGateway)).handle(req, res);
  }));

  router.put("/classroom/:classroom_id", asyncHandler(async (req, res, next) => {
    const classroomGateway = new ClassroomGateway(req.dbClient);
    await new EditClassroomController(new EditClassroom(classroomGateway)).handle(req, res);
  }));

  router.delete("/classroom/:classroom_id", asyncHandler(async (req, res, next) => {
    const classroomGateway = new ClassroomGateway(req.dbClient);
    await new DeleteClassroomController(new DeleteClassroom(classroomGateway)).handle(req, res);
  }));

  router.get("/classroom/:classroom_id", asyncHandler(async (req, res, next) => {
    const classroomGateway = new ClassroomGateway(req.dbClient);
    await new GetClassroomController(new GetClassroom(classroomGateway)).handle(req, res);
  }));
};