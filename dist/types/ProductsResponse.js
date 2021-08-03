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
exports.ProductsResponse = void 0;
const type_graphql_1 = require("type-graphql");
const Product_1 = require("../entity/Product");
const formError_1 = require("./formError");
let ProductsResponse = class ProductsResponse {
};
__decorate([
    type_graphql_1.Field(() => [formError_1.FormError], { nullable: true }),
    __metadata("design:type", Array)
], ProductsResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => [Product_1.Product], { nullable: true }),
    __metadata("design:type", Array)
], ProductsResponse.prototype, "products", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProductsResponse.prototype, "message", void 0);
ProductsResponse = __decorate([
    type_graphql_1.ObjectType()
], ProductsResponse);
exports.ProductsResponse = ProductsResponse;
//# sourceMappingURL=ProductsResponse.js.map