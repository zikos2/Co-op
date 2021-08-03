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
exports.UserUpdateInput = exports.UserSignInInput = exports.UserSignUpInput = void 0;
const type_graphql_1 = require("type-graphql");
const graphql_custom_types_1 = require("graphql-custom-types");
let UserSignUpInput = class UserSignUpInput {
};
__decorate([
    type_graphql_1.Directive("@lowerCase"),
    type_graphql_1.Field(() => graphql_custom_types_1.GraphQLEmail),
    __metadata("design:type", String)
], UserSignUpInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Directive("@lowerCase"),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserSignUpInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserSignUpInput.prototype, "password", void 0);
UserSignUpInput = __decorate([
    type_graphql_1.InputType()
], UserSignUpInput);
exports.UserSignUpInput = UserSignUpInput;
let UserSignInInput = class UserSignInInput {
};
__decorate([
    type_graphql_1.Directive("@lowerCase"),
    type_graphql_1.Field(() => graphql_custom_types_1.GraphQLEmail),
    __metadata("design:type", String)
], UserSignInInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserSignInInput.prototype, "password", void 0);
UserSignInInput = __decorate([
    type_graphql_1.InputType()
], UserSignInInput);
exports.UserSignInInput = UserSignInInput;
let UserUpdateInput = class UserUpdateInput {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserUpdateInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(() => graphql_custom_types_1.GraphQLEmail, { nullable: true }),
    __metadata("design:type", String)
], UserUpdateInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserUpdateInput.prototype, "location", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserUpdateInput.prototype, "about", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserUpdateInput.prototype, "phoneNumber", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserUpdateInput.prototype, "igLink", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserUpdateInput.prototype, "fbLink", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserUpdateInput.prototype, "image", void 0);
UserUpdateInput = __decorate([
    type_graphql_1.InputType()
], UserUpdateInput);
exports.UserUpdateInput = UserUpdateInput;
//# sourceMappingURL=UserInputs.js.map