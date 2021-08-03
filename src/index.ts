import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection, getConnection } from "typeorm";
import * as connectRedis from "connect-redis";
import * as cors from "cors";
import * as path from "path";
import * as helmet from "helmet";
import * as express from "express";
import * as passport from "passport";
import * as session from "express-session";
import { graphqlUploadExpress } from "graphql-upload";

import { redis } from "./redis";
import { UserResolver } from "./resolvers/UserResolver";
import { ProductResolver } from "./resolvers/ProductResolver";
import { OrderResolver } from "./resolvers/OrderResolver";
import { createProductsLoader } from "./helpers/productsLoader";



const main = async () => {
    try {
        await createConnection();
    } catch (error) {
        console.log(error);
    }

    const app = Express();
    /**
     * Redis
     */

    const RedisStore = connectRedis(session);
    redis.on("error", (error) => {
        console.log(error.message);
    });
    redis.on("connect", function () {
        console.log(`Redis connected at localhost:6379`);
    });
    /**
     * Apply middelwares
     */
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        }),
    );     
    app.use(
        helmet({
            contentSecurityPolicy:
                process.env.NODE_ENV === "production" ? undefined : false,
        }),
    );
    app.use(express.json());
    app.use(
        express.urlencoded({
            extended: true,
        }),
    );
    app.use(
        session({
            store: new RedisStore({
                client: redis,
                disableTouch: true,
            }),
            name: "qid",
            secret: "redisstoresecret",
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
            },
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(
        "/images",
        express.static(path.join(__dirname, "..", "/assets/images")),
    );

    const schema = await buildSchema({
        resolvers: [
            UserResolver,
            ProductResolver,
            OrderResolver,
        ],
    });
    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
    new ApolloServer({
        schema,
        uploads: false,
        context({ req, res }) {
            return {
                req,
                res,
                redis,
                passport,
                productsLoader: createProductsLoader(),
                getConnection,
            };
        },
    }).applyMiddleware({ app, cors: false });

    app.listen(4000, () => {
        console.log("server started on http://localhost:4000/graphql");
    });
};

main();
