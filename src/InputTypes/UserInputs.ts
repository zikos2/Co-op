import { Directive, Field, InputType } from "type-graphql";
import { GraphQLEmail } from "graphql-custom-types";

@InputType()
export class UserSignUpInput {
    @Directive("@lowerCase")
    @Field(() => GraphQLEmail)
    email!: string;

    @Directive("@lowerCase")
    @Field()
    username!: string;

    @Field()
    password!: string;
}

@InputType()
export class UserSignInInput {
    @Directive("@lowerCase")
    @Field(() => GraphQLEmail)
    email!: string;

    @Field()
    password!: string;
}

@InputType()
export class UserUpdateInput {
    @Field(() => String, { nullable: true })
    username?: string;

    @Field(() => GraphQLEmail, { nullable: true })
    email?: string;

    @Field(() => String, { nullable: true })
    location?: string;

    @Field(() => String, { nullable: true })
    about?: string;

    @Field(() => String, { nullable: true })
    phoneNumber?: string;

    @Field(() => String, { nullable: true })
    igLink?: string;

    @Field(() => String, { nullable: true })
    fbLink?: string;

    @Field(() => String, { nullable: true })
    image?: string;
}
