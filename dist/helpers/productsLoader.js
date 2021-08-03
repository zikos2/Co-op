"use strict";
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
exports.createProductsLoader = void 0;
const DataLoader = require("dataloader");
const typeorm_1 = require("typeorm");
const OrderProduct_1 = require("../entity/OrderProduct");
const batchProducts = (orderIds) => __awaiter(void 0, void 0, void 0, function* () {
    const productOrders = yield OrderProduct_1.OrderProduct.find({
        join: {
            alias: "orderProduct",
            innerJoinAndSelect: {
                product: "orderProduct.product",
            },
        },
        where: {
            orderId: typeorm_1.In(orderIds),
        },
    });
    const orderIdToProducts = {};
    productOrders.forEach((op) => {
        op.__product__.orderQuantity = op.orderQuantity;
    });
    productOrders.forEach((op) => {
        if (op.orderId in orderIdToProducts) {
            orderIdToProducts[op.orderId].push(op.__product__);
        }
        else {
            orderIdToProducts[op.orderId] = [op.__product__];
        }
    });
    console.log("productOrders", productOrders);
    return orderIds.map((orderId) => orderIdToProducts[orderId]);
});
const createProductsLoader = () => new DataLoader(batchProducts);
exports.createProductsLoader = createProductsLoader;
//# sourceMappingURL=productsLoader.js.map