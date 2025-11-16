import ExpressServer from "./server";

console.log("Starting application...");
console.log("Environment variables:");
console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "SET" : "NOT SET");
console.log("- DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET");

const server = new ExpressServer();

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

console.log("Calling server.start()...");
server.start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});