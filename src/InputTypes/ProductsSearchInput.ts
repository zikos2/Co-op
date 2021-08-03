import { Field, InputType, Int } from "type-graphql";

@InputType()
export class ProductsSearchInput {
    @Field(() => String)
    title?: string;

    @Field(() => Int)
    minPrice?: number;

    @Field(() => Int)
    maxPrice?: number;
}
