import gql from "graphql-tag"

export const SIGNUP_MUTATION = gql`
    mutation AnonymousSignupMutation {
        anonymousSignup {
            token
            user {
                id
                name
                email
            }
        }
    }
`

export const CREATE_RADIO_MUTATION = gql`
    mutation CreateRadioMutation($name: String!){
        createRadio(name:$name){
            id
            hash
            name
        }
    }
`


export const CONNECT_RADIO_MUTATION = gql`
    mutation ConnectToRadioMutation($hash: String!){
        connectToRadio(hash: $hash){
            id
        }
    }
`

export const SEND_MEDIA_ITEM_MUTATION = gql`
    mutation sendMediaItemMutation (
        $radioId: String!,
        $externalId: String!,
        $title: String!,
        $thumbnailUrl: String,
        $channelTitle: String,
        $publishedAt: String,
    ){
        sendMediaItem(
            radioId: $radioId
            source: "youtube"
            externalId: $externalId
            title: $title
            thumbnailUrl: $thumbnailUrl
            channelTitle: $channelTitle
            publishedAt: $publishedAt
        ){
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
    }
`

export const PLAY_MUTATION = gql`
    mutation PlayMutation($radioId: String!, $mediaItemId: String){
        play(
            radioId: $radioId
            mediaItemId: $mediaItemId
        ){
            id
            title
            status
        }
    }
`
