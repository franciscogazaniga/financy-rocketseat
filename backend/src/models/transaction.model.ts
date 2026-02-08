import { Field, GraphQLISODateTime, ID, ObjectType, registerEnumType } from "type-graphql";
import { UserModel } from "./user.model";
import { CategoryModel } from "./category.model";
import { TransactionType } from "@prisma/client";

registerEnumType(TransactionType, {
  name: "TransactionType"
})

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  authorId!: string

  @Field(() => UserModel, { nullable: true })
  author?: UserModel

  @Field(() => String)
  categoryId!: string

  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel

  @Field(() => String)
  description!: string

  @Field(() => String)
  value!: string

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => GraphQLISODateTime)
  date!: Date

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date
}