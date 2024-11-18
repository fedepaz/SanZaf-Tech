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

  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      if (
        process.env.NODE_ENV === "production" &&
        origin &&
        /\.vercel\.app$/.test(origin)
      ) {
        callback(null, true);
      } else if (process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
};
