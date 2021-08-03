import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@ObjectType()
@Entity()
export class OrderProduct extends BaseEntity {
    @PrimaryColumn()
    orderId: string;

    @PrimaryColumn()
    productId: string;

    @Field(() => Number, { nullable: true })
    @Column({
        type: "int",
        nullable: true,
    })
    orderQuantity: number;

    @ManyToOne(() => Order, (order) => order.productConnection, {
        primary: true,
    })
    @JoinColumn({ name: "orderId" })
    order: Promise<Order>;

    @Field(() => Product)
    @ManyToOne(() => Product, (product) => product.orderConnection, {
        primary: true,
    })
    @JoinColumn({ name: "productId" })
    product: Promise<Product>;
}
