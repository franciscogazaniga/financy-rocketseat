import { gql } from '@apollo/client'

export const LIST_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      title
      description
      icon
      color
      transactionsCount
      transactions {
        id
        description
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

// export const GET_CATEGORY = gql`
//   query GetCategory($categoryId: String!){
//     getCategory(id: $categoryId) {
//       id
//       title
//       description
//       icon
//       color
//       transaction {
//         id
//         description
//       }
//       authorId
//       author {
//         id
//         name
//         email
//       }
//       createdAt
//       updatedAt
//     }
//   }
// `