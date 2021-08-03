import * as DataLoader from "dataloader";
import { In } from "typeorm";
import { OrderProduct } from "../entity/OrderProduct";
import { OrderProductType } from "../types/Order/OrderProductType";

const batchProducts = async (orderIds: readonly string[]) => {
    const productOrders = await OrderProduct.find({
        join: {
            alias: "orderProduct",
            innerJoinAndSelect: {
                product: "orderProduct.product",
            },
        },
        where: {
            orderId: In(orderIds as string[]),
        },
    });

    const orderIdToProducts: { [key: string]: OrderProductType[] } = {};

    //Mapping orderQuantity to product
    productOrders.forEach((op) => {
        (op as any).__product__.orderQuantity = op.orderQuantity;
    });

    productOrders.forEach((op) => {
        if (op.orderId in orderIdToProducts) {
            orderIdToProducts[op.orderId].push((op as any).__product__);
        } else {
            orderIdToProducts[op.orderId] = [(op as any).__product__];
        }
    });
    return orderIds.map((orderId) => orderIdToProducts[orderId]);
};

export const createProductsLoader = () => new DataLoader(batchProducts);
