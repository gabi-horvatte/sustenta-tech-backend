import ExpressServer from "./server";
import { initializeDefaultManager } from "./setup/initialize-manager";

async function startApplication() {
  console.log("Starting application...");
  console.log("Environment variables:");
  console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "SET" : "NOT SET");
  console.log("- DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET");
  console.log("- MANAGER_EMAIL:", process.env.MANAGER_EMAIL ? "SET" : "NOT SET");
  console.log("- MANAGER_PASSWORD:", process.env.MANAGER_PASSWORD ? "SET" : "NOT SET");

  // Initialize default manager account
  await initializeDefaultManager();

  const server = new ExpressServer();

  console.log("Calling server.start()...");
  await server.start();
}


// Add process event listeners to catch unexpected exits
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startApplication().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});