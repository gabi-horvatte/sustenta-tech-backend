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
import { setupActivityTemplatesRoutes } from '@/modules/ActivityTemplates/adapters/express';
import { setupMaterialTemplatesRoutes } from '@/modules/MaterialTemplates/adapters/express';
import { setupAnalyticsRoutes } from '@/modules/Analytics/adapters/express';
import { transactionEndMiddleware, transactionErrorMiddleware } from './middlewares/transaction-end';

export default class ExpressServer {
  async start() {
    console.log("ExpressServer.start() called");
    const app = express();
    console.log("Express app created");
    console.log("FRONTEND_URL environment variable:", process.env.FRONTEND_URL);
    // CORS configuration for production deployment
    const corsOptions = {
      origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
          process.env.FRONTEND_URL,
          'http://localhost:5173',
          'http://localhost:3000',
          'https://localhost:5173',
          'https://localhost:3000'
        ].filter(Boolean); // Remove undefined values

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.log(`CORS blocked origin: ${origin}`);
          console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
          callback(new Error('Not allowed by CORS'), false);
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
      credentials: true,
      optionsSuccessStatus: 200, // Some legacy browsers choke on 204
      preflightContinue: false,
    };

    app.use(cors(corsOptions));
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
    setupActivityTemplatesRoutes(app);
    setupMaterialTemplatesRoutes(app);
    setupAnalyticsRoutes(app);
  }
}
