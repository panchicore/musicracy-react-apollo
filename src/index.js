import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import {BrowserRouter} from 'react-router-dom'
import {ApolloProvider} from 'react-apollo'
import {ApolloClient} from 'apollo-client'
import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {persistCache} from 'apollo-cache-persist'
import {ApolloProvider as ApolloHooksProvider} from 'react-apollo-hooks'
import {setContext} from 'apollo-link-context'
import {AUTH_TOKEN} from './constants'
import {split} from 'apollo-link'
import {WebSocketLink} from 'apollo-link-ws'
import {getMainDefinition} from 'apollo-utilities'
import {resolvers, typeDefs} from "./graphql"

const SERVER = '192.168.0.15:4000'

const httpLink = createHttpLink({
  uri: `http://${SERVER}`,
})

const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const wsLink = new WebSocketLink({
  uri: `ws://${SERVER}`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN),
    },
  },
})

const link = split(
  ({query}) => {
    const {kind, operation} = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink),
)

const cache = new InMemoryCache()

persistCache({
  cache,
  storage: window.localStorage,
})

const client = new ApolloClient({
  link,
  cache,
  typeDefs,
  resolvers,
  connectToDevTools: true
})

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem(AUTH_TOKEN),
  }
})

ReactDOM.render(
  <BrowserRouter>
    <ApolloHooksProvider client={client}>
      <ApolloProvider client={client}>
        <App/>
      </ApolloProvider>
    </ApolloHooksProvider>
  </BrowserRouter>,
  document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
