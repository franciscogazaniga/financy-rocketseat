import { gql } from '@apollo/client'

export const LIST_TRANSACTIONS = gql`
  query GetTransactions {
    getTransactions {
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

export const GET_TRANSACTION = gql`
  query GetTransaction($transactionId: String!){
    getTransaction(id: $transactionId) {
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