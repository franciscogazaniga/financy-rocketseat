import { TransactionType } from "@prisma/client"
import { Field, GraphQLISODateTime, InputType, Int } from "type-graphql"

@InputType()
export class TransactionFilters {
  @Field(() => Int, { defaultValue: 1 })
  page?: number

  @Field(() => Int, { defaultValue: 10 })
  limit?: number

  @Field(() => String, { nullable: true })
  sortField?: string

  @Field(() => String, { nullable: true })
  sortOrder?: "asc" | "desc"

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType

  @Field(() => String, { nullable: true })
  categoryId?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date
}