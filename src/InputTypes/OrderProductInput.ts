import { Field, InputType } from "type-graphql";

@InputType()
export class OrderProductInput {
    @Field(() => String)
    productId: string;

    @Field(() => Number)
    orderQuantity: number;
}
