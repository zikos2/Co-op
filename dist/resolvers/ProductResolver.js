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
exports.ProductResolver = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const graphql_upload_1 = require("graphql-upload");
const fs_1 = require("fs");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Product_1 = require("../entity/Product");
const User_1 = require("../entity/User");
const ProductInputs_1 = require("../InputTypes/ProductInputs");
const ProductsSearchInput_1 = require("../InputTypes/ProductsSearchInput");
const ProductResponse_1 = require("../types/ProductResponse");
const ProductsResponse_1 = require("../types/ProductsResponse");
class ProductResolver {
    getAllproducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield typeorm_1.getManager().transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                return transaction.find(Product_1.Product);
            }));
            console.log(products);
            return {
                products,
            };
        });
    }
    searchProducts(filters, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let productQB = typeorm_1.getRepository(Product_1.Product).createQueryBuilder("product");
                if (filters.title) {
                    console.log("title called");
                    productQB = productQB.andWhere("product.title iLike :title", {
                        title: `%${filters.title}%`,
                    });
                }
                if (filters.minPrice) {
                    productQB = productQB.andWhere("product.price >= (:minPrice)", {
                        minPrice: filters.minPrice,
                    });
                    console.log("minCalled");
                }
                if (filters.maxPrice) {
                    productQB = productQB.andWhere("product.price <= (:maxPrice)", {
                        maxPrice: filters.maxPrice,
                    });
                    console.log("maxCalled");
                }
                console.log(productQB);
                console.log("ok1");
                const products = yield productQB.skip(offset).take(limit).getMany();
                console.log("ok2");
                console.log(products);
                return {
                    products,
                };
            }
            catch (err) {
                console.log(err);
                return {
                    errors: [
                        {
                            message: err.message,
                            field: "exeption",
                        },
                    ],
                };
            }
        });
    }
    getUserProducts(userId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.session.userId);
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
                const user = yield User_1.User.findOne(req.session.userId || userId, {
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
                console.log(user.products);
                return {
                    products: user.products,
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
    getProduct(pid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield typeorm_1.getManager().transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                    return transaction.findOne(Product_1.Product, {
                        where: {
                            id: pid,
                        },
                    });
                }));
                return {
                    product,
                };
            }
            catch (err) {
                throw Error(err.message);
            }
        });
    }
    getRecommendation(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield Product_1.Product.find({ where: { category } });
                return {
                    products
                };
            }
            catch (error) {
                console.log(error);
                return {
                    errors: [
                        {
                            field: "exeption",
                            message: error.message
                        }
                    ]
                };
            }
        });
    }
    increaseProductViews(pid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getRepository(Product_1.Product).increment({ id: pid }, "numVisits", 1);
                return true;
            }
            catch (error) {
                console.log(error);
                throw Error(error);
            }
        });
    }
    addProductImage({ filename, createReadStream }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(filename);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                return createReadStream()
                    .pipe(fs_1.createWriteStream(__dirname + `/../../assets/images/products/${filename}`))
                    .on("finish", () => resolve(filename))
                    .on("error", (err) => reject(err));
            }));
        });
    }
    addProduct(params, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield typeorm_1.getManager().transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                    const existingProduct = yield transaction.findOne(Product_1.Product, {
                        where: {
                            title: params.title,
                        },
                    });
                    console.log(existingProduct);
                    if (existingProduct) {
                        throw new apollo_server_errors_1.UserInputError("Product with the same title already exists", {
                            field: "title",
                        });
                    }
                    const newProduct = transaction.create(Product_1.Product, {
                        title: params.title,
                        category: params.category,
                        imageUrl: params.imageUrl,
                        price: params.price,
                        quantity: params.quantity,
                        unit: params.unit,
                        description: params.description,
                        userId: req.session.userId,
                    });
                    yield transaction.save(newProduct, {
                        reload: true,
                    });
                    return newProduct;
                }));
                return {
                    product,
                };
            }
            catch (error) {
                return {
                    errors: [
                        {
                            field: error.field || "expetion",
                            message: error.message,
                        },
                    ],
                };
            }
        });
    }
    updateProduct(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield typeorm_1.getManager().transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                    const exist = yield transaction.findOne(Product_1.Product, {
                        where: {
                            id: params.id,
                        },
                    });
                    if (!exist) {
                        throw Error("Product not available");
                    }
                    const updatedProduct = yield transaction
                        .getRepository(Product_1.Product)
                        .save(Object.assign(Object.assign({}, exist), params));
                    return updatedProduct;
                }));
                return {
                    product,
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
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Product_1.Product.delete({ id });
                return true;
            }
            catch (error) {
                throw Error(error.message);
                return false;
            }
        });
    }
}
__decorate([
    type_graphql_1.Query(() => ProductsResponse_1.ProductsResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getAllproducts", null);
__decorate([
    type_graphql_1.Query(() => ProductsResponse_1.ProductsResponse),
    __param(0, type_graphql_1.Arg("filters", () => ProductsSearchInput_1.ProductsSearchInput)),
    __param(1, type_graphql_1.Arg("limit", () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Arg("offset", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProductsSearchInput_1.ProductsSearchInput, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "searchProducts", null);
__decorate([
    type_graphql_1.Query(() => ProductsResponse_1.ProductsResponse),
    __param(0, type_graphql_1.Arg("userId", { nullable: true })),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getUserProducts", null);
__decorate([
    type_graphql_1.Query(() => ProductResponse_1.ProductResponse),
    __param(0, type_graphql_1.Arg("pid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getProduct", null);
__decorate([
    type_graphql_1.Query(() => ProductsResponse_1.ProductsResponse),
    __param(0, type_graphql_1.Arg("category")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getRecommendation", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("pid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "increaseProductViews", null);
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Arg("image", () => graphql_upload_1.GraphQLUpload)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "addProductImage", null);
__decorate([
    type_graphql_1.Mutation(() => ProductResponse_1.ProductResponse),
    __param(0, type_graphql_1.Arg("params")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProductInputs_1.ProductAddInput, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "addProduct", null);
__decorate([
    type_graphql_1.Mutation(() => ProductResponse_1.ProductResponse),
    __param(0, type_graphql_1.Arg("params")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProductInputs_1.ProductUpdateInput]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "updateProduct", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "deleteProduct", null);
exports.ProductResolver = ProductResolver;
//# sourceMappingURL=ProductResolver.js.map