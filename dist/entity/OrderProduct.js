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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderProduct = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Order_1 = require("./Order");
const Product_1 = require("./Product");
let OrderProduct = class OrderProduct extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], OrderProduct.prototype, "orderId", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], OrderProduct.prototype, "productId", void 0);
__decorate([
    type_graphql_1.Field(() => Number, { nullable: true }),
    typeorm_1.Column({
        type: "int",
        nullable: true,
    }),
    __metadata("design:type", Number)
], OrderProduct.prototype, "orderQuantity", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Order_1.Order, (order) => order.productConnection, {
        primary: true,
    }),
    typeorm_1.JoinColumn({ name: "orderId" }),
    __metadata("design:type", Promise)
], OrderProduct.prototype, "order", void 0);
__decorate([
    type_graphql_1.Field(() => Product_1.Product),
    typeorm_1.ManyToOne(() => Product_1.Product, (product) => product.orderConnection, {
        primary: true,
    }),
    typeorm_1.JoinColumn({ name: "productId" }),
    __metadata("design:type", Promise)
], OrderProduct.prototype, "product", void 0);
OrderProduct = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], OrderProduct);
exports.OrderProduct = OrderProduct;
//# sourceMappingURL=OrderProduct.js.map