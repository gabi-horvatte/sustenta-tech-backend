import express from "express";
import { setupClassroomRoutes } from "../modules/Classroom/adapters/express";
import { setupAuthenticationRoutes } from "../modules/Authentication/adapters/express";
import { logger } from "../logger";
import { errorHandler } from "./middlewares/error-handler";
import { loggerMiddleware } from './middlewares/logger-middleware';
import { transactionStartMiddleware } from './middlewares/transaction-start';
import { authenticationMiddleware } from "./middlewares/authentication";
import { setupActivitiesRoutes } from '@/modules/Activities/adapters/express';
import { setupNotificationsRoutes } from '@/modules/Notifications/adapters/express';
import cors from 'cors';
import { setupMaterialsRoutes } from '@/modules/Materials/adapters/express';
import { transactionEndMiddleware, transactionErrorMiddleware } from './middlewares/transaction-end';

export default class ExpressServer {
  async start() {
    console.log("ExpressServer.start() called");
    const app = express();
    console.log("Express app created");
    app.use(cors({
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }))
    app.use(express.json());
    app.use(loggerMiddleware);
    app.use(transactionStartMiddleware);
    app.use(authenticationMiddleware);
    console.log("Setting up routes...");
    this.setupRoutes(app);
    console.log("Routes setup complete");
    app.use(transactionEndMiddleware);
    app.use(transactionErrorMiddleware);
    app.use(errorHandler);
    console.log("Starting server on port 3000...");
    app.listen(3000, () => {
      console.log("Server listen callback called");
      logger.info("Server is running on port 3000");
    });
  }

  private setupRoutes(app: express.Express) {
    setupClassroomRoutes(app);
    setupAuthenticationRoutes(app);
    setupActivitiesRoutes(app);
    setupNotificationsRoutes(app);
    setupMaterialsRoutes(app);
  }
}
