import gql from "graphql-tag"

const MEDIA_ITEM_FRAGMENT = gql`
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
`
export const NEW_MEDIA_ITEM_SUBSCRIPTION = gql`
    subscription RadioMediaItemCreatedSubscription($radioId: ID!) {
        radioMediaItemCreated(radioId: $radioId){
            ...Item
        }
    }
    ${MEDIA_ITEM_FRAGMENT}
`

export const UPDATED_MEDIA_ITEM_SUBSCRIPTION = gql`
    subscription RadioMediaItemUpdatedSubscription($radioId: ID!) {
        radioMediaItemUpdated(radioId: $radioId){
            ...Item
        }
    }
    ${MEDIA_ITEM_FRAGMENT}
`

