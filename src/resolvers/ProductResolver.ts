import { UserInputError } from "apollo-server-errors";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { createWriteStream } from "fs";
import { Arg, Ctx, Int, Mutation, Query, UseMiddleware } from "type-graphql";
import { getManager, getRepository } from "typeorm";

import { Product } from "../entity/Product";
import { User } from "../entity/User";
import {
    ProductAddInput,
    ProductUpdateInput,
} from "../InputTypes/ProductInputs";
import { ProductsSearchInput } from "../InputTypes/ProductsSearchInput";
import { ProductResponse } from "../types/ProductResponse";
import { ProductsResponse } from "../types/ProductsResponse";
import { ContextType } from "./ContextType";
import { isAuth } from "../helpers/isAuth";


export class ProductResolver {
    @Query(() => ProductsResponse)
    async getAllproducts(): Promise<ProductsResponse> {
        const products = await Product.find();
        return {
            products,
        };
    }

    @Query(() => ProductsResponse)
    async searchProducts(
        @Arg("filters", () => ProductsSearchInput) filters: ProductsSearchInput,
        @Arg("limit", () => Int) limit: number,
        @Arg("offset", () => Int) offset: number,
    ): Promise<ProductsResponse> {
        try {
            let productQB = getRepository(Product).createQueryBuilder(
                "product",
            );
            if (filters.title) {
                productQB = productQB.andWhere("product.title iLike :title", {
                    title: `%${filters.title}%`,
                });
            }
            if (filters.minPrice) {
                productQB = productQB.andWhere("product.price >= (:minPrice)", {
                    minPrice: filters.minPrice,
                });
            }
            if (filters.maxPrice) {
                productQB = productQB.andWhere("product.price <= (:maxPrice)", {
                    maxPrice: filters.maxPrice,
                });
            }
            
            const products = await productQB.skip(offset).take(limit).getMany();

            return {
                products,
            };
        } catch (err) {
            return {
                errors: [
                    {
                        message: err.message,
                        field: "exeption",
                    },
                ],
            };
        }
    }

    @Query(() => ProductsResponse)
    async getUserProducts(
        @Arg("userId", { nullable: true }) userId: string,
        @Ctx() { req }: ContextType,
    ): Promise<ProductsResponse> {
        try {
            if (!req.session.userId && !userId) {
                return {
                    errors: [
                        {
                            field: "user",
                            message: "No id was provided",
                        },
                    ],
                };
            }
            const user = await User.findOne(req.session.userId || userId, {
                relations: ["products"],
            });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "user",
                            message: "User Does not exist",
                        },
                    ],
                };
            }
            return {
                products: user.products,
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

    @Query(() => ProductResponse)
    async getProduct(@Arg("pid") pid: string): Promise<ProductResponse> {
        try {
            const product = await getManager().transaction(
                async (transaction) => {
                    return transaction.findOne(Product, {
                        where: {
                            id: pid,
                        },
                    });
                },
            );
            return {
                product,
            };
        } catch (err) {
            throw Error(err.message);
        }
    }

    @Query(() => ProductsResponse)
    async getRecommendation(
        @Arg("category") category: string
    ): Promise<ProductsResponse>{
        try{
            const products = await Product.find({where:{category}})
            return {
                products
            }
        }catch(error){
            return {
                errors:[
                    {
                        field:"exeption",
                        message: error.message
                    }
                ]
            }
        }
    }

    @Mutation(() => Boolean)
    async increaseProductViews(@Arg("pid") pid: string): Promise<boolean> {
        try {
            await getRepository(Product).increment({ id: pid }, "numVisits", 1);
            return true;
        } catch (error) {
            throw Error(error);
        }
    }

    @Mutation(() => String)
    @UseMiddleware(isAuth)
    async addProductImage(
        @Arg("image", () => GraphQLUpload)
        { filename, createReadStream }: FileUpload,
    ) {
        return new Promise(async (resolve, reject) => 
            createReadStream()
                .pipe(
                    createWriteStream(
                        __dirname + `/../../assets/images/products/${filename}`,
                    ),
                )
                .on("finish", () => resolve(filename))
                .on("error", (err) => reject(err))
        );
    }

    @Mutation(() => ProductResponse)
    @UseMiddleware(isAuth)
    async addProduct(
        @Arg("params") params: ProductAddInput,
        @Ctx() { req }: ContextType,
    ): Promise<ProductResponse> {
        try {
            const product = await getManager().transaction(
                async (transaction) => {
                    const existingProduct = await transaction.findOne(Product, {
                        where: {
                            title: params.title,
                        },
                    });
                    if (existingProduct) {
                        throw new UserInputError(
                            "Product with the same title already exists",
                            {
                                field: "title",
                            },
                        );
                    }
                    const newProduct = transaction.create(Product, {
                        title: params.title,
                        category: params.category,
                        imageUrl: params.imageUrl,
                        price: params.price,
                        quantity: params.quantity,
                        unit: params.unit,
                        description: params.description,
                        userId: req.session.userId,
                    });
                    await transaction.save(newProduct, {
                        reload: true,
                    });
                    return newProduct;
                },
            );
            return {
                product,
            };
        } catch (error) {
            return {
                errors: [
                    {
                        field: error.field || "expetion",
                        message: error.message,
                    },
                ],
            };
        }
    }

    @Mutation(() => ProductResponse)
    @UseMiddleware(isAuth)
    async updateProduct(
        @Arg("params") params: ProductUpdateInput,
    ): Promise<ProductResponse> {
        try {
            const product = await getManager().transaction(
                async (transaction) => {
                    const exist = await transaction.findOne(Product, {
                        where: {
                            id: params.id,
                        },
                    });
                    if (!exist) {
                        throw Error("Product not available");
                    }
                    const updatedProduct = await transaction
                        .getRepository(Product)
                        .save({
                            ...exist,
                            ...params,
                        });

                    return updatedProduct;
                },
            );
            return {
                product,
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
    @UseMiddleware(isAuth)
    async deleteProduct(@Arg("id") id: string): Promise<boolean> {
        try {
            await Product.delete({ id });
            return true;
        } catch (error) {
            throw Error(error.message);
        }
    }
}
