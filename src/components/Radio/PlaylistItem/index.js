import React, {useContext} from "react"
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles
} from "@material-ui/core"
import ImageIcon from '@material-ui/icons/Image'
import clsx from 'clsx'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import ReplayIcon from '@material-ui/icons/Replay'
import {Mutation} from "react-apollo"
import {PLAY_MUTATION} from "../../../graphql"
import {useSnackbar} from "notistack"
import {SEND_MEDIA_ITEM_MUTATION} from "../../../graphql/mutations"
import {SearchContext} from "../contexts"
import {SEARCH_RELATED_TO_TAG} from "../../../constants"

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  }
}))

function PlaylistItem({user, radioId, item, status}) {

  const classes = useStyles()
  const searchContext = useContext(SearchContext)
  let showPlayIcon = user.isCreator && status === 'QUEUED'
  let showSendAgainIcon = status === 'PLAYED'
  const {enqueueSnackbar} = useSnackbar()

  return (

      <ListItem dense>
        <ListItemAvatar>
          <Avatar src={item.thumbnailUrl}
                  className={clsx([
                    classes.avatar,
                    status === 'NOW_PLAYING' && classes.bigAvatar
                  ])}
                  onClick={() => {
                    searchContext.setQuerySearch(`${SEARCH_RELATED_TO_TAG} ${item.externalId}`)
                  }}
          >
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={item.title} secondary={item.sentBy.name}/>
        <ListItemSecondaryAction>
          {showPlayIcon &&
            <IconButton edge="end" aria-label="delete">
              <Mutation
                mutation={PLAY_MUTATION}
                variables={{radioId, mediaItemId: item.id}}
                update={(cache, {data: {play}}) => {
                  console.log("PLAY_MUTATION", cache, play)
                }}
                onError={(error) => {
                  error.graphQLErrors.map(err => enqueueSnackbar(err.message, {variant: 'error'}))
                }}>
                {(playMutation, {loading, error, data}) => {
                  return (
                    <PlayArrowIcon color={loading ? 'disabled' : 'inherit'} onClick={() => playMutation()}/>
                  )
                }}
              </Mutation>
            </IconButton>
          }

          {showSendAgainIcon &&
            <IconButton edge="end" aria-label="delete">
              <Mutation
                mutation={SEND_MEDIA_ITEM_MUTATION}
                variables={{radioId, ...item }}
                onError={(error) => {
                  error.graphQLErrors.map(err => enqueueSnackbar(err.message, {variant: 'error'}))
                }}
              >
                {(sendMutation, {loading, error, data}) => {
                  return (
                    <ReplayIcon color={loading ? 'disabled' : 'inherit'} onClick={() => sendMutation()}/>
                  )
                }}
              </Mutation>
            </IconButton>
          }

        </ListItemSecondaryAction>
      </ListItem>

  )
}

export default PlaylistItem