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
exports.OrdersResponse = void 0;
const type_graphql_1 = require("type-graphql");
const Order_1 = require("../../entity/Order");
const formError_1 = require("../formError");
let OrdersResponse = class OrdersResponse {
};
__decorate([
    type_graphql_1.Field(() => [formError_1.FormError], { nullable: true }),
    __metadata("design:type", Array)
], OrdersResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => [Order_1.Order], { nullable: true }),
    __metadata("design:type", Array)
], OrdersResponse.prototype, "orders", void 0);
OrdersResponse = __decorate([
    type_graphql_1.ObjectType()
], OrdersResponse);
exports.OrdersResponse = OrdersResponse;
//# sourceMappingURL=OrdersResponse.js.map