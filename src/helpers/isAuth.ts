import { MiddlewareFn } from "type-graphql";

import { ContextType } from "../resolvers/ContextType";

export const isAuth: MiddlewareFn<ContextType> = async ({ context }, next) => {
    if (!context.req.session?.userId) {
        throw new Error("not authenticated");
    }

    return next();
};
