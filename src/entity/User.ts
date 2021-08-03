import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";
import { Order } from "./Order";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field(() => String)
    @Column({
        type: "varchar",
    })
    email!: string;

    @Column({
        type: "varchar",
    })
    password!: string;

    @Field(() => String, {
        nullable: true,
    })
    @Column({
        type: "varchar",
        nullable: true,
        unique: true,
    })
    username?: string;

    @Field(() => String, { nullable: true })
    @Column({
        type: "varchar",
        nullable: true,
    })
    about?: string;

    @Field(() => String, { nullable: true })
    @Column({
        type: "varchar",
        nullable: true,
    })
    location?: string;

    @Field(() => String, { nullable: true })
    @Column({
        type: "varchar",
        nullable: true,
    })
    image?: string;

    @Field(() => String, { nullable: true })
    @Column({
        type: "varchar",
        nullable: true,
    })
    fbLink?: string;

    @Field(() => String, { nullable: true })
    @Column({
        type: "varchar",
        nullable: true,
    })
    igLink?: string;

    @Field(() => String, { nullable: true })
    @Column({
        type: "varchar",
        nullable: true,
    })
    phoneNumber?: string;

    @Field(() => String)
    @Column({
        type: "varchar",
        default: "false",
    })
    profileCompleted: string;

    @Field(() => Number)
    @Column({
        type: "int",
        default: 0,
    })
    numVisits: number;

    @Field(() => Date)
    @CreateDateColumn({
        type: "timestamp with time zone",
    })
    createdAt!: Date;

    @Field(() => [Product])
    @OneToMany(() => Product, (product) => product.user)
    products: Product[];

    @Field(() => [Order])
    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}
