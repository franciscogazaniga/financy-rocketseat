import { gql } from '@apollo/client'

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($data: CreateTransactionInput!) {
    createTransaction(data: $data) {
      id
      description
      value
      type
      date
      categoryId
      category {
        id
        title
        description
        icon
        color
      }
      authorId
      author {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
  }
`