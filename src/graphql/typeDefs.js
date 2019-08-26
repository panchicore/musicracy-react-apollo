import gql from "graphql-tag"

export const typeDefs = gql`
    extend type Query {
        isLoggedIn: Boolean!
        user: User
    }
    
    extend type User {
        id: ID!
        name: String!
        email: String!
    }
`