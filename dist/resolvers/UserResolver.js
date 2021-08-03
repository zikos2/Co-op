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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const bcryptjs_1 = require("bcryptjs");
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
const UserInputs_1 = require("../InputTypes/UserInputs");
const apollo_server_errors_1 = require("apollo-server-errors");
const UserResponse_1 = require("../types/UserResponse");
const UsersResponse_1 = require("../types/UsersResponse");
const graphql_upload_1 = require("graphql-upload");
const fs_1 = require("fs");
let UserResolver = class UserResolver {
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.session.userId && !req.user) {
                    return {
                        errors: [
                            {
                                field: "user",
                                message: "User already logged out.",
                            },
                        ],
                    };
                }
                const user = yield User_1.User.findOne(req.session.userId || req.user.id, {
                    relations: ["products", "orders"],
                });
                console.log(user);
                return {
                    user,
                };
            }
            catch (error) {
                return {
                    errors: [
                        {
                            field: "exception",
                            message: error.message,
                        },
                    ],
                };
            }
        });
    }
    getUser(id, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let cid;
                if (id) {
                    cid = id;
                }
                else {
                    cid = req.session.userId;
                }
                const user = yield User_1.User.findOne(cid, {
                    relations: ["products", "orders"],
                });
                if (!user) {
                    throw Error("Invalid user");
                }
                return {
                    user,
                };
            }
            catch (error) {
                return {
                    errors: [
                        {
                            field: "exeption",
                            message: error.message,
                        },
                    ],
                };
            }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_1.User.find({
                    relations: ["products", "orders"],
                });
                if (users.length < 1) {
                    throw Error("No user available");
                }
                return {
                    users,
                };
            }
            catch (error) {
                return {
                    errors: [
                        {
                            field: "exeption",
                            message: error.message,
                        },
                    ],
                };
            }
        });
    }
    addProfilePicture({ filename, createReadStream }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                createReadStream()
                    .pipe(fs_1.createWriteStream(__dirname +
                    `/../../assets/images/cooperations/${filename}`))
                    .on("finish", () => resolve(filename))
                    .on("error", (err) => reject(err));
            }));
        });
    }
    signup({ email, password, username }, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                password = yield bcryptjs_1.hash(password, 12);
                const user = yield typeorm_1.getManager().transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const existingUser = yield transaction.findOne(User_1.User, {
                        where: [
                            {
                                email,
                            },
                            {
                                username,
                            },
                        ],
                    });
                    if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.email) === email) {
                        throw new apollo_server_errors_1.UserInputError("A user with same email already exists.", {
                            field: "email",
                        });
                    }
                    if (((_a = existingUser === null || existingUser === void 0 ? void 0 : existingUser.username) === null || _a === void 0 ? void 0 : _a.toLowerCase()) ===
                        username.toLowerCase()) {
                        throw new apollo_server_errors_1.UserInputError("A user with same username already exists.", {
                            field: "username",
                        });
                    }
                    const user = transaction.create(User_1.User, {
                        username,
                        email,
                        password,
                    });
                    yield transaction.save(user, {
                        reload: true,
                    });
                    return user;
                }));
                req.session.userId = user.id;
                return {
                    user,
                };
            }
            catch (error) {
                return {
                    errors: [
                        {
                            field: error.field || "exception",
                            message: error.message,
                        },
                    ],
                };
            }
        });
    }
    signin({ email, password }, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                email = email.toLocaleLowerCase();
                console.log("the email: ++++++", email);
                const user = yield typeorm_1.getManager().transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield transaction.findOne(User_1.User, {
                        where: {
                            email,
                        },
                    });
                    if (!user) {
                        throw new apollo_server_errors_1.UserInputError("Wrong email", {
                            field: "email",
                        });
                    }
                    const valid = yield bcryptjs_1.compare(password, user.password);
                    if (!valid) {
                        throw new apollo_server_errors_1.UserInputError("Wrong Password", {
                            field: "password",
                        });
                    }
                    return user;
                }));
                req.session.userId = user.id;
                return {
                    user,
                };
            }
            catch (error) {
                return {
                    errors: [
                        {
                            field: error.field || "exception",
                            message: error.message,
                        },
                    ],
                };
            }
        });
    }
    updateUser(params, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("called");
            try {
                const userId = req.session.userId;
                const user = yield typeorm_1.getManager().transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                    const exist = yield transaction.findOne(User_1.User, {
                        where: {
                            id: userId,
                        },
                    });
                    if (!exist) {
                        throw Error("User not available");
                    }
                    const updatedUser = yield transaction.getRepository(User_1.User).save(Object.assign(Object.assign({}, exist), params));
                    return updatedUser;
                }));
                return {
                    user,
                };
            }
            catch (error) {
                return {
                    errors: [
                        {
                            field: error.field || "exeption",
                            message: error.message,
                        },
                    ],
                };
            }
        });
    }
    increaseProfileVisits(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getRepository(User_1.User).increment({ id: uid }, "numVisits", 1);
                return true;
            }
            catch (error) {
                console.log(error);
                throw Error(error);
            }
        });
    }
    logout({ req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => req.session.destroy((err) => {
                if (err) {
                    console.log(err);
                    return reject(false);
                }
                res.clearCookie("qid");
                return resolve(true);
            }));
        });
    }
};
__decorate([
    type_graphql_1.Query(() => UserResponse_1.UserResponse, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Query(() => UserResponse_1.UserResponse),
    __param(0, type_graphql_1.Arg("id", { nullable: true })),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUser", null);
__decorate([
    type_graphql_1.Query(() => UsersResponse_1.UsersResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUsers", null);
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Arg("picture", () => graphql_upload_1.GraphQLUpload)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "addProfilePicture", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse_1.UserResponse),
    __param(0, type_graphql_1.Arg("params")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserInputs_1.UserSignUpInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "signup", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse_1.UserResponse),
    __param(0, type_graphql_1.Arg("params")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserInputs_1.UserSignInInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "signin", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse_1.UserResponse),
    __param(0, type_graphql_1.Arg("params")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserInputs_1.UserUpdateInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("uid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "increaseProfileVisits", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map