import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($userId: String!){
    getUser(id: $userId) {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`