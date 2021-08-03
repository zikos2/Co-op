import { Directive, Field, ID, InputType } from "type-graphql";

@InputType()
export class ProductAddInput {
    @Directive("@lowercase")
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
}

@InputType()
export class ProductUpdateInput {
    @Field(() => ID)
    id: string;

    @Directive("@lowercase")
    @Field(() => String)
    title?: string;

    @Field(() => String)
    category?: string;

    @Field(() => String)
    imageUrl?: string;

    @Field(() => Number)
    price?: number;

    @Field(() => Number)
    quantity?: number;

    @Field(() => String)
    description?: string;

    @Field(() => String)
    unit: string;
}
