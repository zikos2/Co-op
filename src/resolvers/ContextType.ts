import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import * as passport from "passport";
import { RedisClient } from "redis";

import { User } from "../entity/User";
import { createProductsLoader } from "../helpers/productsLoader";

export type ContextType = {
    req: Request & {
        session: Session & Partial<SessionData> & { userId: string };
        refreshToken: string;
        user: User;
    };
    res: Response;
    redisClient: RedisClient;
    productsLoader: ReturnType<typeof createProductsLoader>;
    passport: typeof passport;
};
