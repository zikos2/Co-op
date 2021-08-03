import { ObjectType, Field } from "type-graphql";
import { User } from "../entity/User";
import { FormError } from "./formError";

@ObjectType()
export class UserResponse {
    @Field(() => [FormError], { nullable: true })
    errors?: FormError[];

    @Field(() => User, { nullable: true })
    user?: User;

    @Field(() => String, { nullable: true })
    message?: string;
}
