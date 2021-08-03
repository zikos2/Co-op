import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class OrderProductType {
    @Field(() => String)
    id!: string;

    @Field(() => String)
    title: string;

    @Field(() => String)
    category: string;

    @Field(() => String)
    imageUrl: string;

    @Field(() => Number)
    price: number;

    @Field(() => Number)
    quantity: number;

    @Field(() => String)
    description: string;

    @Field(() => String)
    unit: string;

    @Field(() => Number)
    orderQuantity: number;

    @Field(() => Number)
    numVisits: number;

    @Field(() => String)
    userId: string;
}
