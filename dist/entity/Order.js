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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.Order = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const OrderProductType_1 = require("../types/Order/OrderProductType");
const OrderProduct_1 = require("./OrderProduct");
const User_1 = require("./User");
let Order = class Order extends typeorm_1.BaseEntity {
    products({ productsLoader }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(productsLoader);
            return productsLoader.load(this.id);
        });
    }
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({
        type: "varchar",
    }),
    __metadata("design:type", String)
], Order.prototype, "customerFirstName", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({
        type: "varchar",
    }),
    __metadata("design:type", String)
], Order.prototype, "customerLastName", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({
        type: "varchar",
    }),
    __metadata("design:type", String)
], Order.prototype, "customerPhone", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({
        type: "varchar",
    }),
    __metadata("design:type", String)
], Order.prototype, "customerEmail", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({
        type: "varchar",
    }),
    __metadata("design:type", String)
], Order.prototype, "customerLocation", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean),
    typeorm_1.Column({
        type: "boolean",
        default: "false",
    }),
    __metadata("design:type", Boolean)
], Order.prototype, "confirmed", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({
        type: "varchar",
        default: "pending",
    }),
    __metadata("design:type", String)
], Order.prototype, "state", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({
        type: "varchar",
        nullable: true,
    }),
    __metadata("design:type", String)
], Order.prototype, "userId", void 0);
__decorate([
    type_graphql_1.Field(() => Number),
    typeorm_1.Column({
        type: "float",
        nullable: true,
    }),
    __metadata("design:type", Number)
], Order.prototype, "total", void 0);
__decorate([
    typeorm_1.OneToMany(() => OrderProduct_1.OrderProduct, (op) => op.order),
    __metadata("design:type", Promise)
], Order.prototype, "productConnection", void 0);
__decorate([
    type_graphql_1.Field(() => [OrderProductType_1.OrderProductType]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Order.prototype, "products", null);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.orders),
    __metadata("design:type", User_1.User)
], Order.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Order.prototype, "created_at", void 0);
Order = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Order);
exports.Order = Order;
//# sourceMappingURL=Order.js.map