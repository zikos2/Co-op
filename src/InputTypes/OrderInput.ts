import { Field, InputType } from "type-graphql";
import { OrderProductInput } from "./OrderProductInput";

@InputType()
export class OrderInput {
    @Field(() => String)
    customerFirstName: string;

    @Field(() => String)
    customerLastName: string;

    @Field(() => String)
    customerPhone: string;

    @Field(() => String)
    customerEmail: string;

    @Field(() => String)
    customerLocation: string;

    @Field(() => Number)
    total: number;

    @Field(() => [OrderProductInput])
    orderProducts: OrderProductInput[];

    @Field(() => String)
    userId: string;
}
