import React, {useEffect, useState} from "react"
import YouTube from 'react-youtube'
import {useMutation, useQuery, useSubscription} from "react-apollo-hooks"
import {NEW_MEDIA_ITEM_SUBSCRIPTION, UPDATED_MEDIA_ITEM_SUBSCRIPTION} from "../../graphql"
import {makeStyles} from "@material-ui/core"
import {withRouter} from "react-router"
import {FINISH_MUTATION} from "../../graphql/mutations"
import gql from "graphql-tag"

const YOUTUBE_IFRAME_OPTIONS = {
  height: '490',
  width: '100%',
  playerVars: { // https://developers.google.com/youtube/player_parameters
    autoplay: 1
  }
}

const useStyles = makeStyles(theme => ({
  youtubeIframe: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
}));

function FinishItem({radioId, item, onNext}){
  // mutate the item finished to play
  // backend 1. set it as finished, 2. set next item as NOW PLAYING if available, 3. returns it

  const [finishIt, {loading}] = useMutation(FINISH_MUTATION, {
    variables: {
      radioId,
      mediaItemId: item.id,
      playNext: true
    }
  })

  useEffect(() => {
    finishIt()
    onNext()
  }, [])

  return null
}

function PlayItem({item, onFinish}){
  const classes = useStyles()
  return (
    <YouTube
      className={classes.youtubeIframe}
      videoId={item.externalId}
      opts={YOUTUBE_IFRAME_OPTIONS}
      onReady={() => {}}
      onStateChange={({target, data}) => {
        /*
        -1 (unstarted)
        0 (ended)
        1 (playing)
        2 (paused)
        3 (buffering)
        5 (video cued).
       */
        if(data===0){

          onFinish()

        }
      }}
    />
  )
}

const NOW_PLAYING_QUERY = gql`
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
            itemsPlaying{
                ...Item
            }
        }
    }
`


function Player({match}){

  const classes = useStyles()
  const radioId = match.params.radioId
  const [nowPlaying, setNowPlaying] = useState(null)
  const [finish, setFinish] = useState(null)

  const {loading, error, data} = useQuery(NOW_PLAYING_QUERY, {
    variables: {radioId}
  })

  console.log(data)

  useEffect(() => {
    if(data && nowPlaying === null){

      if(data.radio.itemsPlaying.length > 0){
        setNowPlaying(data.radio.itemsPlaying[0])
      }
    }
  }, [data])

  const onFinish = (playNext) => {
    setFinish(nowPlaying)
    setNowPlaying(null)
  }

  const onNext = () => {
    setFinish(null)
  }

  // detect new NOW PLAYING items
  useSubscription(UPDATED_MEDIA_ITEM_SUBSCRIPTION, {
    variables: {radioId},
    onSubscriptionData: ({client, subscriptionData: {data: {radioMediaItemUpdated}}}) => {
      console.log("UPDATED_MEDIA_ITEM_SUBSCRIPTION", radioMediaItemUpdated)
      if(radioMediaItemUpdated.status === 'NOW_PLAYING'){
        setNowPlaying(radioMediaItemUpdated)
      }
    }
  })

  useSubscription(NEW_MEDIA_ITEM_SUBSCRIPTION, {
    variables: {radioId},
    onSubscriptionData: ({client, subscriptionData: {data: {radioMediaItemCreated}}}) => {
      console.log("NEW_MEDIA_ITEM_SUBSCRIPTION", radioMediaItemCreated)
      if(radioMediaItemCreated.status === 'NOW_PLAYING' && nowPlaying === null ){
        setNowPlaying(radioMediaItemCreated)
      }
    }
  })

  if(finish){
    return (
      <FinishItem radioId={radioId} item={finish} onNext={onNext} />
    )
  }

  if(nowPlaying){
    return (
      <div>
        <PlayItem radioId={radioId} item={nowPlaying} onFinish={onFinish} />
      </div>
    )
  }

  return (
    <div>
      <p>Musicracy Player, press play on your phone radio to start.</p>
      {loading && <p>Loading music...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  )

}

export default withRouter(Player)