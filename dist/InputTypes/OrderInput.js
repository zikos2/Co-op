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
exports.OrderInput = void 0;
const type_graphql_1 = require("type-graphql");
const OrderProductInput_1 = require("./OrderProductInput");
let OrderInput = class OrderInput {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], OrderInput.prototype, "customerFirstName", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], OrderInput.prototype, "customerLastName", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], OrderInput.prototype, "customerPhone", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], OrderInput.prototype, "customerEmail", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], OrderInput.prototype, "customerLocation", void 0);
__decorate([
    type_graphql_1.Field(() => Number),
    __metadata("design:type", Number)
], OrderInput.prototype, "total", void 0);
__decorate([
    type_graphql_1.Field(() => [OrderProductInput_1.OrderProductInput]),
    __metadata("design:type", Array)
], OrderInput.prototype, "orderProducts", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], OrderInput.prototype, "userId", void 0);
OrderInput = __decorate([
    type_graphql_1.InputType()
], OrderInput);
exports.OrderInput = OrderInput;
//# sourceMappingURL=OrderInput.js.map