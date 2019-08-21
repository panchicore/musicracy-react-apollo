import React, {useContext, useEffect, useState} from "react"
import {useQuery} from "react-apollo-hooks"
import {SEARCH_MEDIA_QUERY} from "../../../graphql"
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles
} from "@material-ui/core"
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import CheckIcon from '@material-ui/icons/Check'
import {Mutation} from "react-apollo"
import {SEND_MEDIA_ITEM_MUTATION} from "../../../graphql/mutations"
import {useSnackbar} from "notistack"
import {SearchContext} from "../contexts"
import {SEARCH_RELATED_TO_TAG} from "../../../constants"
import _ from "lodash"

const useStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2),
  },
}))

function SearchResultItem({radioId, item, onMediaItemSearchUpdate, setSearchMoreForItem}){
  const searchContext = useContext(SearchContext)
  const { enqueueSnackbar } = useSnackbar()
  const margin = item.depth * 20
  return (
    <ListItem style={{marginLeft: margin}}>
      <ListItemAvatar>
        <Avatar
          onClick={() => {
            setSearchMoreForItem(item)
            searchContext.setQuerySearch(`${SEARCH_RELATED_TO_TAG} ${item.id}`)
          }}
          src={item.thumbnailUrl} />
      </ListItemAvatar>
      <ListItemText
        primary={item.title}
        secondary={item.channelTitle}
      />
      <ListItemSecondaryAction>
        {item.exists ? (
          <CheckIcon />
        ):(
          <Mutation
            mutation={SEND_MEDIA_ITEM_MUTATION}
            update={(cache, {data: {sendMediaItem}}) => {
              onMediaItemSearchUpdate(cache, sendMediaItem)
            }}
            variables={{externalId: item.id, radioId, ...item}}
            onError={(error) => {
              error.graphQLErrors.map(err => enqueueSnackbar(err.message, {variant: 'error'}))
            }}
          >
            {(addMutation, {loading}) => {
              return(
                <IconButton edge="end" aria-label="add" onClick={addMutation}>
                  <PlaylistAddIcon color={loading ? 'disabled' : 'inherit'}/>
                </IconButton>
              )
            }}
          </Mutation>
        )}

      </ListItemSecondaryAction>
    </ListItem>
  )
}

function Search({radioId}) {

  const classes = useStyles()
  const searchContext = useContext(SearchContext)
  const variables = {radioId, filter: searchContext.querySearch}
  const {enqueueSnackbar} = useSnackbar()
  const [items, setItems] = useState([])
  const [searchMoreForItem, setSearchMoreForItem] = useState(null)

  const {loading, error, data} = useQuery(SEARCH_MEDIA_QUERY, {
    variables,
    fetchPolicy: 'network-only'
  })

  useEffect(() => {
    if(!error && data && data.searchMedia.length > 0){
      if(searchMoreForItem){
        const i = _.findIndex(items, {id: searchMoreForItem.id})
        setItems([
          ...items.slice(0, i + 1),
          ...data.searchMedia.map(item => ({...item, depth: searchMoreForItem.depth + 1})),
          ...items.slice(i + 1)
        ])
      }else{
        setItems(data.searchMedia.map(item => ({...item, depth: 0})))
      }
    }
  }, [data])

  const _onMediaItemSearchUpdate = (store, sendMediaItem) => {
    let data = store.readQuery({query: SEARCH_MEDIA_QUERY, variables})
    data = {...data,
      searchMedia: data.searchMedia.map(sm => (
        sm.id === sendMediaItem.externalId ? {...sm, exists: true} : sm
      ))
    }
    store.writeQuery({query: SEARCH_MEDIA_QUERY, variables, data})
  }

  if (loading && !searchContext.querySearch.startsWith(SEARCH_RELATED_TO_TAG)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" alignContent="center">
        <CircularProgress className={classes.progress}/>
      </Box>
    )
  }

  if(error){
    enqueueSnackbar(error.message, {variant: 'error'})
    searchContext.setQuerySearch("")
    return null
  }

  return (
    <List dense={false}>
      {items.map((item, index) =>
        <SearchResultItem
          key={index}
          radioId={radioId}
          item={item}
          onMediaItemSearchUpdate={_onMediaItemSearchUpdate}
          setSearchMoreForItem={setSearchMoreForItem}/>
      )}
    </List>
  )
}

export default Search