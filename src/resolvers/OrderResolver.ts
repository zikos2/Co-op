import { Arg, Mutation, Query, UseMiddleware } from "type-graphql";
import { getManager, getRepository } from "typeorm";

import { Order } from "../entity/Order";
import { OrderProduct } from "../entity/OrderProduct";
import { User } from "../entity/User";
import { isAuth } from "../helpers/isAuth";
import { OrderInput } from "../InputTypes/OrderInput";
import { OrderResponse } from "../types/Order/OrderResponse";
import { OrdersResponse } from "../types/Order/OrdersResponse";


export class OrderResolver {
    @Query(() => OrdersResponse)
    async getOrders(): Promise<OrdersResponse> {
        try {
            const orders = await getRepository(Order).find();

            return {
                orders,
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

    @Query(() => OrderResponse)
    async getOrder(@Arg("orderId") orderId: string): Promise<OrderResponse> {
        try {
            const order = await getRepository(Order).findOne({
                where: { id: orderId },
            });

            return {
                order,
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

    @Mutation(() => OrderResponse)
    async createOrder(
        @Arg("params") params: OrderInput,
    ): Promise<OrderResponse> {
        try {
            const user = await getRepository(User).findOne({
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
            const order = await getManager().transaction(
                async (transaction) => {
                    const newOrder = transaction.create(Order, {
                        customerEmail: params.customerEmail,
                        customerFirstName: params.customerFirstName,
                        customerLastName: params.customerLastName,
                        customerLocation: params.customerLocation,
                        customerPhone: params.customerPhone,
                        userId: params.userId,
                        total: params.total,
                    });

                    await transaction.save(newOrder, {
                        reload: true,
                    });

                    params.orderProducts.forEach((op) => {
                        transaction
                            .create(OrderProduct, {
                                orderId: newOrder.id,
                                orderQuantity: op.orderQuantity,
                                productId: op.productId,
                            })
                            .save();
                    });
                    return newOrder;
                },
            );

            return {
                order,
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

    @Mutation(() => OrderResponse)
    @UseMiddleware(isAuth)
    async UpdateOrderState(
        @Arg("orderId") orderId: string,
        @Arg("state") state: string,
    ): Promise<OrderResponse> {
        try {
            const order = await getManager().transaction(
                async (transaction) => {
                    const exist = await transaction.findOne(Order, {
                        where: {
                            id: orderId,
                        },
                    });

                    if (!exist) {
                        throw Error("Order doesn't exist");
                    }
                    const updatedOrder = await transaction
                        .getRepository(Order)
                        .save({
                            ...exist,
                            state,
                        });
                    return updatedOrder;
                },
            );
            return {
                order,
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
}
