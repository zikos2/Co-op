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
exports.OrderResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Order_1 = require("../entity/Order");
const OrderProduct_1 = require("../entity/OrderProduct");
const User_1 = require("../entity/User");
const OrderInput_1 = require("../InputTypes/OrderInput");
const OrderResponse_1 = require("../types/Order/OrderResponse");
const OrdersResponse_1 = require("../types/Order/OrdersResponse");
class OrderResolver {
    getOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield typeorm_1.getRepository(Order_1.Order).find();
                return {
                    orders,
                };
            }
            catch (error) {
                console.log(error);
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
    getOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield typeorm_1.getRepository(Order_1.Order).findOne({
                    where: { id: orderId },
                });
                return {
                    order,
                };
            }
            catch (error) {
                console.log(error);
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
    createOrder(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield typeorm_1.getRepository(User_1.User).findOne({
                    where: { id: params.userId },
                });
                if (!user) {
                    return {
                        errors: [
                            {
                                field: "userId",
                                message: "No user was found",
                            },
                        ],
                    };
                }
                const order = yield typeorm_1.getManager().transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                    const newOrder = transaction.create(Order_1.Order, {
                        customerEmail: params.customerEmail,
                        customerFirstName: params.customerFirstName,
                        customerLastName: params.customerLastName,
                        customerLocation: params.customerLocation,
                        customerPhone: params.customerPhone,
                        userId: params.userId,
                        total: params.total,
                    });
                    yield transaction.save(newOrder, {
                        reload: true,
                    });
                    params.orderProducts.forEach((op) => {
                        transaction
                            .create(OrderProduct_1.OrderProduct, {
                            orderId: newOrder.id,
                            orderQuantity: op.orderQuantity,
                            productId: op.productId,
                        })
                            .save();
                    });
                    return newOrder;
                }));
                return {
                    order,
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
    UpdateOrderState(orderId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield typeorm_1.getManager().transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                    const exist = yield transaction.findOne(Order_1.Order, {
                        where: {
                            id: orderId,
                        },
                    });
                    if (!exist) {
                        throw Error("Order doesn't exist");
                    }
                    const updatedOrder = yield transaction
                        .getRepository(Order_1.Order)
                        .save(Object.assign(Object.assign({}, exist), { state }));
                    return updatedOrder;
                }));
                return {
                    order,
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
}
__decorate([
    type_graphql_1.Query(() => OrdersResponse_1.OrdersResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "getOrders", null);
__decorate([
    type_graphql_1.Query(() => OrderResponse_1.OrderResponse),
    __param(0, type_graphql_1.Arg("orderId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "getOrder", null);
__decorate([
    type_graphql_1.Mutation(() => OrderResponse_1.OrderResponse),
    __param(0, type_graphql_1.Arg("params")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [OrderInput_1.OrderInput]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "createOrder", null);
__decorate([
    type_graphql_1.Mutation(() => OrderResponse_1.OrderResponse),
    __param(0, type_graphql_1.Arg("orderId")),
    __param(1, type_graphql_1.Arg("state")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "UpdateOrderState", null);
exports.OrderResolver = OrderResolver;
//# sourceMappingURL=OrderResolver.js.map