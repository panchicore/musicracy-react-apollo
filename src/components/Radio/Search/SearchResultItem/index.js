import {useSnackbar} from "notistack"
import React, {useState} from "react"
import {
  Avatar,
  Collapse,
  IconButton, List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core"
import {Mutation} from "react-apollo"
import {SEND_MEDIA_ITEM_MUTATION} from "../../../../graphql/mutations"
import {AvatarSearchRelated} from "../AvatarSearchRelated"
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import CheckIcon from "@material-ui/icons/Check"

export function SearchResultItem({radioId, item}){

  const { enqueueSnackbar } = useSnackbar()
  const margin = item.depth * 20

  const [isSent, setIsSent] = useState(item.exists)
  const [searchRelated, setSearchRelated] = useState(false)
  const [searchRelatedResults, setSearchRelatedResults] = useState([])

  const onSearchRelatedResults = (searchMedia) => {
    setSearchRelated(false)
    setSearchRelatedResults(searchMedia)
  }

  return (
    <React.Fragment>
      <ListItem style={{marginLeft: margin}}>
        <ListItemAvatar>
          {searchRelated ? (
            <AvatarSearchRelated
              radioId={radioId}
              item={item}
              onSearchRelatedResults={onSearchRelatedResults}
            />
          ) : (
            <Avatar
              onClick={() => {
                setSearchRelated(true)
              }}
              src={item.thumbnailUrl} />
          )}
        </ListItemAvatar>
        <ListItemText
          primary={item.title}
          secondary={item.channelTitle}
        />
        <ListItemSecondaryAction>
          {isSent ? (
            <CheckIcon />
          ):(
            <Mutation
              mutation={SEND_MEDIA_ITEM_MUTATION}
              update={() => {setIsSent(true)}}
              variables={{externalId: item.id, radioId, ...item}}
              onError={(error) => {
                error.graphQLErrors.map(err => enqueueSnackbar(err.message, {variant: 'error'}))
              }}
            >
              {(addMutation, {loading}) => {
                if(loading){
                  return <HourglassEmptyIcon />
                }
                return(
                  <IconButton edge="end" aria-label="add" onClick={addMutation}>
                    <PlaylistAddIcon/>
                  </IconButton>
                )
              }}
            </Mutation>
          )}
        </ListItemSecondaryAction>
      </ListItem>

      <Collapse in={true} timeout="auto" unmountOnExit>
        <List dense={false} component="div" disablePadding>
          {searchRelatedResults.map((item, index) =>
            <SearchResultItem
              key={index}
              radioId={radioId}
              item={item} />
          )}
        </List>
      </Collapse>

    </React.Fragment>
  )
}