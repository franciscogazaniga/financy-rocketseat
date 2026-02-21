import { useAuthStore } from '@/stores/auth';
import { ApolloClient, ApolloLink, CombinedGraphQLErrors, HttpLink, InMemoryCache } from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from "@apollo/client/link/error"

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql"
})

const authLink = new SetContextLink((prevContext) => {
  const token = useAuthStore.getState().token

  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = new ErrorLink(({ error }) => {
  const { logout } = useAuthStore.getState()

  if (error instanceof CombinedGraphQLErrors) {
    for (const err of error.errors) {
      if (err.extensions?.code === "UNAUTHENTICATED") {
        logout()
        window.location.replace("/login")
        return
      }
    }
  }

  if ("statusCode" in error && error.statusCode === 401) {
    logout()
    window.location.replace("/login")
  }
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
})