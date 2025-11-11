import { Router } from "express";
import EditOwnProfileController from "./edit-own-profile";
import AccountGateway from "../../datasource/Account/gateway";
import EditOwnProfile from "../../application/use-cases/EditOwnProfile";
import DeleteAccount from "../../application/use-cases/DeleteAccount";
import DeleteAccountController from "./delete";
import LoginController from './login';
import Login from "../../application/use-cases/Login";
import TeacherGateway from "@/modules/Classroom/datasource/Teacher/gateway";
import { asyncHandler } from '@/express/utils/async-handler';
import StudentGateway from '@/modules/Classroom/datasource/Student/gateway';

export const setupAuthenticationRoutes = (router: Router) => {
  router.put("/account/edit-own-profile", asyncHandler(async (req, res, next) => {
    const accountGateway = new AccountGateway(req.dbClient);
    await new EditOwnProfileController(new EditOwnProfile(accountGateway)).handle(req, res);
  }));

  router.delete("/account/:account_id", asyncHandler(async (req, res, next) => {
    const accountGateway = new AccountGateway(req.dbClient);
    await new DeleteAccountController(new DeleteAccount(accountGateway)).handle(req, res);
  }));

  router.post("/login", asyncHandler(async (req, res, next) => {
    const accountGateway = new AccountGateway(req.dbClient);
    const teacherGateway = new TeacherGateway(req.dbClient);
    const studentGateway = new StudentGateway(req.dbClient);
    await new LoginController(new Login(accountGateway, teacherGateway, studentGateway)).handle(req, res);
  }));
};