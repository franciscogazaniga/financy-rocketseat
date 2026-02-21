import { gql } from '@apollo/client'

export const LIST_CATEGORIES = gql`
  query ListCategoriesWithStats {
    listCategoriesWithStats {
      id
      title
      description
      icon
      color
      authorId
      author {
        id
        name
        email
      }
      transactionsCount
      totalValue
      createdAt
      updatedAt
    }
  }
`

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      title
    }
  }
`