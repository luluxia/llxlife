import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client"
import { offsetLimitPagination } from "@apollo/client/utilities";
const client = new ApolloClient({
  uri: 'https://hasura.llx.ink/v1/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          llxlife_article: offsetLimitPagination(['where']),
          llxlife_photo: offsetLimitPagination(['where'])
        },
      },
    },
  })
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
