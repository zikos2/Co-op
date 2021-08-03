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
exports.ProductUpdateInput = exports.ProductAddInput = void 0;
const type_graphql_1 = require("type-graphql");
let ProductAddInput = class ProductAddInput {
};
__decorate([
    type_graphql_1.Directive("@lowercase"),
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], ProductAddInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], ProductAddInput.prototype, "category", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], ProductAddInput.prototype, "imageUrl", void 0);
__decorate([
    type_graphql_1.Field(() => Number),
    __metadata("design:type", Number)
], ProductAddInput.prototype, "price", void 0);
__decorate([
    type_graphql_1.Field(() => Number),
    __metadata("design:type", Number)
], ProductAddInput.prototype, "quantity", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], ProductAddInput.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], ProductAddInput.prototype, "unit", void 0);
ProductAddInput = __decorate([
    type_graphql_1.InputType()
], ProductAddInput);
exports.ProductAddInput = ProductAddInput;
let ProductUpdateInput = class ProductUpdateInput {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    __metadata("design:type", String)
], ProductUpdateInput.prototype, "id", void 0);
__decorate([
    type_graphql_1.Directive("@lowercase"),
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], ProductUpdateInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], ProductUpdateInput.prototype, "category", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], ProductUpdateInput.prototype, "imageUrl", void 0);
__decorate([
    type_graphql_1.Field(() => Number),
    __metadata("design:type", Number)
], ProductUpdateInput.prototype, "price", void 0);
__decorate([
    type_graphql_1.Field(() => Number),
    __metadata("design:type", Number)
], ProductUpdateInput.prototype, "quantity", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], ProductUpdateInput.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], ProductUpdateInput.prototype, "unit", void 0);
ProductUpdateInput = __decorate([
    type_graphql_1.InputType()
], ProductUpdateInput);
exports.ProductUpdateInput = ProductUpdateInput;
//# sourceMappingURL=ProductInputs.js.map