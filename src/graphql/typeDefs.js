import gql from "graphql-tag"

export const typeDefs = gql`
    extend type Query {
        isLoggedIn: Boolean!
        user: User
        currentRadioId: String
    }
    
    extend type User {
        id: ID!
        name: String!
        email: String!
    }
`