import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { compare, hash } from "bcryptjs";
import { getManager, getRepository } from "typeorm";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";

import { User } from "../entity/User";
import { ContextType } from "./ContextType";
import {
    UserSignUpInput,
    UserSignInInput,
    UserUpdateInput,
} from "../InputTypes/UserInputs";
import { UserInputError } from "apollo-server-errors";
import { UserResponse } from "../types/UserResponse";
import { UsersResponse } from "../types/UsersResponse";
import { isAuth } from "../helpers/isAuth";

@Resolver()
export class UserResolver {
    @Query(() => UserResponse, { nullable: true })
    async me(@Ctx() { req }: ContextType): Promise<UserResponse> {
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

            const user = await User.findOne(req.session.userId || req.user.id, {
                relations: ["products", "orders"],
            });
            return {
                user,
            };
        } catch (error) {
            return {
                errors: [
                    {
                        field: "exception",
                        message: error.message,
                    },
                ],
            };
        }
    }

    @Query(() => UserResponse)
    async getUser(
        @Arg("id", { nullable: true }) id: string,
        @Ctx() { req }: ContextType,
    ): Promise<UserResponse> {
        try {
            let cid: string;
            if(id){
                cid = id
            }else{
                cid = req.session.userId
            }

            const user = await User.findOne(cid, {
                relations: ["products", "orders"],
            });
            if (!user) {
                throw Error("Invalid user");
            }

            return {
                user,
            };
        } catch (error) {
            return {
                errors: [
                    {
                        field: "exeption",
                        message: error.message,
                    },
                ],
            };
        }
    }
    
    @Query(() => UsersResponse)
    async getUsers(): Promise<UsersResponse> {
        try {
            const users = await User.find({
                relations: ["products", "orders"],
            });

            if (users.length < 1) {
                throw Error("No user available");
            }

            return {
                users,
            };
        } catch (error) {
            return {
                errors: [
                    {
                        field: "exeption",
                        message: error.message,
                    },
                ],
            };
        }
    }


    @Mutation(() => String)
    @UseMiddleware(isAuth)
    async addProfilePicture(
        @Arg("picture", () => GraphQLUpload)
        { filename, createReadStream }: FileUpload,
    ) {
        return new Promise(async (resolve, reject) => {
            createReadStream()
                .pipe(
                    createWriteStream(
                        __dirname +
                            `/../../assets/images/cooperations/${filename}`,
                    ),
                )
                .on("finish", () => resolve(filename))
                .on("error", (err) => reject(err));
        });
    }

    @Mutation(() => UserResponse)
    async signup(
        @Arg("params")
        { email, password, username }: UserSignUpInput,
        @Ctx() { req }: ContextType,
    ): Promise<UserResponse> {
        try {
            password = await hash(password, 12);

            const user = await getManager().transaction(async (transaction) => {
                const existingUser = await transaction.findOne(User, {
                    where: [
                        {
                            email,
                        },
                        {
                            username,
                        },
                    ],
                });

                if (existingUser?.email === email) {
                    throw new UserInputError(
                        "A user with same email already exists.",
                        {
                            field: "email",
                        },
                    );
                }

                if (
                    existingUser?.username?.toLowerCase() ===
                    username.toLowerCase()
                ) {
                    throw new UserInputError(
                        "A user with same username already exists.",
                        {
                            field: "username",
                        },
                    );
                }

                const user = transaction.create(User, {
                    username,
                    email,
                    password,
                });
                await transaction.save(user, {
                    reload: true,
                });

                return user;
            });

            req.session.userId = user.id;

            return {
                user,
            };
        } catch (error) {
            return {
                errors: [
                    {
                        field: error.field || "exception",
                        message: error.message,
                    },
                ],
            };
        }
    }

    @Mutation(() => UserResponse)
    async signin(
        @Arg("params")
        { email, password }: UserSignInInput,
        @Ctx() { req }: ContextType,
    ): Promise<UserResponse> {
        try {
            email = email.toLocaleLowerCase();
            const user = await getManager().transaction(async (transaction) => {
                const user = await transaction.findOne(User, {
                    where: {
                        email,
                    },
                });

                if (!user) {
                    throw new UserInputError("Wrong email", {
                        field: "email",
                    });
                }
                
                const valid = await compare(password, user.password);
                if (!valid) {
                    throw new UserInputError("Wrong Password", {
                        field: "password",
                    });
                }

                return user;
            });

            req.session.userId = user.id;

            return {
                user,
            };
        } catch (error) {
            return {
                errors: [
                    {
                        field: error.field || "exception",
                        message: error.message,
                    },
                ],
            };
        }
    }

    @Mutation(() => UserResponse)
    @UseMiddleware(isAuth)
    async updateUser(
        @Arg("params") params: UserUpdateInput,
        @Ctx() { req }: ContextType,
    ): Promise<UserResponse> {
        console.log("called");
        try {
            const userId = req.session.userId;
            const user = await getManager().transaction(async (transaction) => {
                const exist = await transaction.findOne(User, {
                    where: {
                        id: userId,
                    },
                });

                if (!exist) {
                    throw Error("User not available");
                }

                const updatedUser = await transaction.getRepository(User).save({
                    ...exist,
                    ...params,
                });

                return updatedUser;
            });
            return {
                user,
            };
        } catch (error) {
            return {
                errors: [
                    {
                        field: error.field || "exeption",
                        message: error.message,
                    },
                ],
            };
        }
    }

    @Mutation(() => Boolean)
    async increaseProfileVisits(@Arg("uid") uid: string): Promise<boolean> {
        try {
            await getRepository(User).increment({ id: uid }, "numVisits", 1);
            return true;
        } catch (error) {
            console.log(error);
            throw Error(error);
        }
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async logout(@Ctx() { req, res }: ContextType): Promise<boolean> {
        return new Promise((resolve, reject) =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            req.session!.destroy((err) => {
                if (err) {
                    console.log(err);
                    return reject(false);
                }

                res.clearCookie("qid");
                return resolve(true);
            }),
        );
    }
}
