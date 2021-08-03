import { ObjectType, Field } from "type-graphql";
import { Order } from "../../entity/Order";
import { FormError } from "../formError";

@ObjectType()
export class OrdersResponse {
    @Field(() => [FormError], { nullable: true })
    errors?: FormError[];

    @Field(() => [Order], { nullable: true })
    orders?: Order[];
}
