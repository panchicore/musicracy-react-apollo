import gql from "graphql-tag"

export const USER_QUERY = gql`
    {
        user @client{
            id
            email
            name
        }
    }
`

export const RADIO_QUERY = gql`
    fragment Item on MediaItem{
        id
        title
        status
        externalId
        source
        thumbnailUrl
        channelTitle
        publishedAt
        sentBy{
            id
            name
        }
        sentAt
    }
    query RadioQuery($radioId: ID!){
        radio(id: $radioId) {
            id
            hash
            createdBy {
                id
                name
            }
            itemsPlaying{
                ...Item
            }
            itemsQueued{
                ...Item
            }
            itemsPlayed{
                ...Item
            }
            people{
                connectedAt
                user{
                    name
                    id
                }
            }
        }
        user @client{
            id
            email
            name
        }
    }
    
`

export const SEARCH_MEDIA_QUERY = gql`
    query SearchMedia($radioId: String!, $filter: String!){
        searchMedia(radioId: $radioId, filter: $filter){
            id
            title
            source
            thumbnailUrl
            channelTitle
            publishedAt
            exists
        }
    }
`