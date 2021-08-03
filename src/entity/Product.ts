import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { OrderProduct } from "./OrderProduct";
import { User } from "./User";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field(() => String)
    @Column({
        type: "varchar",
    })
    title: string;

    @Field(() => String)
    @Column({
        type: "varchar",
    })
    category: string;

    @Field(() => String)
    @Column({
        type: "varchar",
    })
    imageUrl: string;

    @Field(() => Number)
    @Column({
        type: "float",
    })
    price: number;

    @Field(() => Number)
    @Column({
        type: "int",
    })
    quantity: number;

    @Field(() => String)
    @Column({
        type: "varchar",
    })
    description: string;

    @Field(() => String)
    @Column({
        type: "varchar",
    })
    unit: string;

    @Field(() => Number)
    @Column({
        type: "int",
        default: 0,
    })
    numVisits: number;

    @Field(() => String)
    @Column({
        type: "varchar",
        nullable: true,
    })
    userId: string;

    @OneToMany(() => OrderProduct, (op) => op.product)
    orderConnection: Promise<OrderProduct[]>;

    @ManyToOne(() => User, (user) => user.products)
    user: User;
}
