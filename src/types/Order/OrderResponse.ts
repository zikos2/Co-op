import { ObjectType, Field } from "type-graphql";
import { Order } from "../../entity/Order";
import { FormError } from "../formError";

@ObjectType()
export class OrderResponse {
    @Field(() => [FormError], { nullable: true })
    errors?: FormError[];

    @Field(() => Order, { nullable: true })
    order?: Order;
}
