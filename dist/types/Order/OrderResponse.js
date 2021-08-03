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
exports.OrderResponse = void 0;
const type_graphql_1 = require("type-graphql");
const Order_1 = require("../../entity/Order");
const formError_1 = require("../formError");
let OrderResponse = class OrderResponse {
};
__decorate([
    type_graphql_1.Field(() => [formError_1.FormError], { nullable: true }),
    __metadata("design:type", Array)
], OrderResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Order_1.Order, { nullable: true }),
    __metadata("design:type", Order_1.Order)
], OrderResponse.prototype, "order", void 0);
OrderResponse = __decorate([
    type_graphql_1.ObjectType()
], OrderResponse);
exports.OrderResponse = OrderResponse;
//# sourceMappingURL=OrderResponse.js.map