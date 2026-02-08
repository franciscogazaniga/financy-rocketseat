import { Field, InputType } from "type-graphql"

@InputType()
export class CategoryFilters {
  @Field(() => String, { nullable: true })
  title?: string
}