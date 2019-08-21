import React, {useState} from "react"
import YouTube from 'react-youtube'
import {useSubscription} from "react-apollo-hooks"
import {NEW_MEDIA_ITEM_SUBSCRIPTION, PLAY_MUTATION, RADIO_QUERY, UPDATED_MEDIA_ITEM_SUBSCRIPTION} from "../../graphql"
import {CURRENT_RADIO_ID} from "../../constants"
import {Box, Grid, makeStyles, Paper} from "@material-ui/core"
import {Mutation, Query} from "react-apollo"
import {withRouter} from "react-router"

const YOUTUBE_IFRAME_OPTIONS = {
  height: '490',
  width: '100%',
  playerVars: { // https://developers.google.com/youtube/player_parameters
    autoplay: 1
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function Player({match}){

  const [nowPlaying, setNowPlaying] = useState(null)
  const [nextToPlay, setNextToPlay] = useState(null)
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState(null)

  const classes = useStyles()
  const radioId = match.params.radioId
  const [playNextMediaItem, setPlayNextMediaItem] = useState(undefined)

  // detect new QUEUED items
  useSubscription(NEW_MEDIA_ITEM_SUBSCRIPTION, {
    variables: {radioId},
    onSubscriptionData: ({client, subscriptionData}) => {
      console.log("NEW_MEDIA_ITEM_SUBSCRIPTION", subscriptionData)
      const {radioMediaItemCreated} = subscriptionData.data
      if (radioMediaItemCreated.status !== "QUEUED"){
        return null
      }
      let data = client.readQuery({query: RADIO_QUERY, variables: {radioId}})
      data.radio = {
        ...data.radio,
        itemsQueued: [...data.radio.itemsQueued, radioMediaItemCreated]
      }
      client.writeQuery({query: RADIO_QUERY, variables: {radioId}, data})
    }
  })

  // detect new NOW PLAYING items
  useSubscription(UPDATED_MEDIA_ITEM_SUBSCRIPTION, {
    variables: {radioId},
    onSubscriptionData: ({client, subscriptionData}) => {
      console.log("UPDATED_MEDIA_ITEM_SUBSCRIPTION", subscriptionData)
      const {radioMediaItemUpdated} = subscriptionData.data
      let data = client.readQuery({query: RADIO_QUERY, variables: {radioId}})
      data.radio = {
        ...data.radio,
        itemsQueued: data.radio.itemsQueued.filter(mediaItem => mediaItem.id !== radioMediaItemUpdated.id),
        itemsPlaying: [radioMediaItemUpdated]
      }
      client.writeQuery({query: RADIO_QUERY, variables: {radioId}, data})
    }
  })

  console.log("playNextMediaItem", playNextMediaItem)
  if(playNextMediaItem !== undefined){
    const mediaItemId = playNextMediaItem === null ? null : playNextMediaItem.id
    return (
      <Mutation
        mutation={PLAY_MUTATION}
        variables={{radioId, mediaItemId}}
        onCompleted={() => setPlayNextMediaItem(undefined)}>
        {(playMutation, {loading, error, data}) => {
          playMutation()
          return null
        }}
      </Mutation>
    )
  }



  return (

    <Query query={RADIO_QUERY} variables={{radioId}} fetchPolicy={'network-only'}>
      {({data, loading, error}) => {

        console.log(error)

        if(loading){
          return (<div>Loading...</div>)
        }

        if(error){
          return (<div>{error.message}</div>)
        }

        let {radio, user} = data
        const {itemsPlaying, itemsQueued, itemsPlayed, people} = radio

        const nowPlaying = itemsPlaying.length > 0 ? itemsPlaying[0] : null
        const nextMediaItem = itemsQueued.length > 0 ? itemsQueued[0] : null

        return (

          <Box m={2} className={classes.root}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Paper className={classes.paper}>
                  {nowPlaying &&
                    <YouTube
                      videoId={nowPlaying.externalId}
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

                          setPlayNextMediaItem(nextMediaItem)

                        }
                      }}
                    />
                  }
                </Paper>
              </Grid>
              <Grid item xs={4}>

                  <Box>

                    {itemsQueued.map(item => (
                      <Paper key={item.id} className={classes.paper}>
                        {item.title}
                      </Paper>
                    ))}
                  </Box>

              </Grid>

            </Grid>
          </Box>

        )
      }}
    </Query>
  )
}

export default withRouter(Player)