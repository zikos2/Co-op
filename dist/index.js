"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const apollo_server_express_1 = require("apollo-server-express");
const Express = require("express");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const connectRedis = require("connect-redis");
const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const redis_1 = require("./redis");
const UserResolver_1 = require("./resolvers/UserResolver");
const ProductResolver_1 = require("./resolvers/ProductResolver");
const OrderResolver_1 = require("./resolvers/OrderResolver");
const productsLoader_1 = require("./helpers/productsLoader");
const graphql_upload_1 = require("graphql-upload");
const path = require("path");
let HelloResolver = class HelloResolver {
    helloWorld() {
        return __awaiter(this, void 0, void 0, function* () {
            return "Bismilah!";
        });
    }
};
__decorate([
    type_graphql_1.Query(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HelloResolver.prototype, "helloWorld", null);
HelloResolver = __decorate([
    type_graphql_1.Resolver()
], HelloResolver);
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield typeorm_1.createConnection();
    }
    catch (error) {
        console.log(error);
    }
    const app = Express();
    const RedisStore = connectRedis(session);
    console.log(path.join(__dirname, "..", "/assets/images"));
    redis_1.redis.on("error", (error) => {
        console.log(error.message);
    });
    redis_1.redis.on("connect", function () {
        console.log(`Redis connected at localhost:6379`);
    });
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true,
    }));
    app.use(helmet({
        contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
    }));
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true,
    }));
    app.use(session({
        store: new RedisStore({
            client: redis_1.redis,
            disableTouch: true,
        }),
        name: "qid",
        secret: "redisstoresecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
        },
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use("/images", express.static(path.join(__dirname, "..", "/assets/images")));
    const schema = yield type_graphql_1.buildSchema({
        resolvers: [
            HelloResolver,
            UserResolver_1.UserResolver,
            ProductResolver_1.ProductResolver,
            OrderResolver_1.OrderResolver,
        ],
    });
    app.use(graphql_upload_1.graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
    new apollo_server_express_1.ApolloServer({
        schema,
        uploads: false,
        context({ req, res }) {
            return {
                req,
                res,
                redis: redis_1.redis,
                passport,
                productsLoader: productsLoader_1.createProductsLoader(),
                getConnection: typeorm_1.getConnection,
            };
        },
    }).applyMiddleware({ app, cors: false });
    app.listen(4000, () => {
        console.log("server started on http://localhost:4000/graphql");
    });
});
main();
//# sourceMappingURL=index.js.map