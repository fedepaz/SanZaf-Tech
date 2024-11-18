import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

export const configureSecurityMiddleware = (app: any) => {
  app.use(helmet());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
  app.use(limiter);

  const allowedOrigins = [
    "https://blogapp-seven.vercel.app/",
    "https://blogapp-git-mainblog-fedepazs-projects.vercel.app/",
    "https://blogapp-ax8hlwjx9-fedepazs-projects.vercel.app/",
    "https://blogapp-git-master-fedepazs-projects.vercel.app/",
    "https://blogapp-kdhoamw28-fedepazs-projects.vercel.app/",
  ];

  const corsOptions = {
    origin:
      process.env.NODE_ENV === "production"
        ? allowedOrigins
        : "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
};
