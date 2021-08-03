import { ObjectType, Field } from "type-graphql";
import { Product } from "../entity/Product";
import { FormError } from "./formError";

@ObjectType()
export class ProductsResponse {
    @Field(() => [FormError], { nullable: true })
    errors?: FormError[];

    @Field(() => [Product], { nullable: true })
    products?: Product[];

    @Field(() => String, { nullable: true })
    message?: string;
}
