import { gql } from '@apollo/client'

export const LIST_TRANSACTIONS = gql`
  query listTransactions($input: TransactionFilters) {
    listTransactions(input: $input) {
      data {
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
      total
      page
      totalPages
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