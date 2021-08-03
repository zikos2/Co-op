import { Ctx, Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from "typeorm";
import { ContextType } from "../resolvers/ContextType";
import { OrderProductType } from "../types/Order/OrderProductType";
import { OrderProduct } from "./OrderProduct";

import { User } from "./User";

@ObjectType()
@Entity()
export class Order extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field(() => String)
    @Column({
        type: "varchar",
    })
    customerFirstName: string;

    @Field(() => String)
    @Column({
        type: "varchar",
    })
    customerLastName: string;

    @Field(() => String)
    @Column({
        type: "varchar",
    })
    customerPhone: string;

    @Field(() => String)
    @Column({
        type: "varchar",
    })
    customerEmail: string;

    @Field(() => String)
    @Column({
        type: "varchar",
    })
    customerLocation: string;

    @Field(() => Boolean)
    @Column({
        type: "boolean",
        default: "false",
    })
    confirmed: boolean;

    @Field(() => String)
    @Column({
        type: "varchar",
        default: "pending",
    })
    state: string;

    @Field(() => String)
    @Column({
        type: "varchar",
        nullable: true,
    })
    userId: string;

    @Field(() => Number)
    @Column({
        type: "float",
        nullable: true,
    })
    total: number;

    @OneToMany(() => OrderProduct, (op) => op.order)
    productConnection: Promise<OrderProduct[]>;

    @Field(() => [OrderProductType])
    async products(
        @Ctx() { productsLoader }: ContextType,
    ): Promise<OrderProductType[]> {
        console.log(productsLoader);
        return productsLoader.load(this.id);
    }

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @Field(() => Date)
    @CreateDateColumn()
    created_at: Date;
}
