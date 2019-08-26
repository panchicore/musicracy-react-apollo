import React, {useContext, useEffect, useState} from "react"
import {Route, Switch, withRouter} from "react-router"
import {AppBar, BottomNavigation, BottomNavigationAction, Box, CircularProgress} from "@material-ui/core"
import {makeStyles} from '@material-ui/core/styles'
import QueueMusicIcon from '@material-ui/icons/QueueMusic'
import HistoryIcon from '@material-ui/icons/History'
import PeopleIcon from '@material-ui/icons/People'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import {NEW_MEDIA_ITEM_SUBSCRIPTION, RADIO_QUERY, UPDATED_MEDIA_ITEM_SUBSCRIPTION} from "../../graphql"
import {Link} from "react-router-dom"
import Playlist from "./Playlist"
import Search from "./Search"
import RadioDrawer from "./RadioDrawer"
import {Query} from "react-apollo"
import SearchInputBase from "./SearchInputBase"
import People from "./People"
import {useSnackbar} from "notistack"
import {useSubscription} from "react-apollo-hooks"
import Info from "./Info"
import {SearchContext} from "./contexts"
import _ from "lodash"
import {CURRENT_RADIO_ID} from "../../constants"

const useStyles = makeStyles(theme => ({
  bottomNavigationAppBar: {
    top: "auto",
    bottom: 0
  },
  progress: {
    margin: theme.spacing(2),
  },
  container: {
    paddingBottom: 50
  }
}))

const RADIO_TABS = [
  {
    label: 'Playlist',
    url: '/radio',
    icon: <QueueMusicIcon/>
  },
  {
    label: 'Recent',
    url: '/radio/recent',
    icon: <HistoryIcon/>
  },
  {
    label: 'People',
    url: '/radio/people',
    icon: <PeopleIcon/>
  },
  {
    label: 'Radio',
    url: '/radio/info',
    icon: <LocationOnIcon/>
  },
]

function Radio({history}) {

  const searchContext = useContext(SearchContext)
  const radioId = localStorage.getItem(CURRENT_RADIO_ID)
  const [querySearch, setQuerySearch] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  useEffect(() => {
    setQuerySearch(searchContext.querySearch)
  }, [searchContext])

  useSubscription(NEW_MEDIA_ITEM_SUBSCRIPTION, {
    variables: {radioId},
    onSubscriptionData: ({client, subscriptionData: {data: {radioMediaItemCreated}}}) => {

      console.log("radioMediaItemCreated", radioMediaItemCreated)
      enqueueSnackbar(`${radioMediaItemCreated.title} was added by ${radioMediaItemCreated.sentBy.name}`)

      let data = client.readQuery({query: RADIO_QUERY, variables: {radioId}})

      if(radioMediaItemCreated.status === 'QUEUED'){
        data.radio = {
          ...data.radio,
          itemsQueued: [...data.radio.itemsQueued, radioMediaItemCreated]
        }
      }else if(radioMediaItemCreated.status === 'NOW_PLAYING'){
        data.radio = {
          ...data.radio,
          itemsPlaying: [radioMediaItemCreated]
        }
      }

      client.writeQuery({query: RADIO_QUERY, variables: {radioId}, data})
    }
  })

  useSubscription(UPDATED_MEDIA_ITEM_SUBSCRIPTION, {
    variables: {radioId},
    onSubscriptionData: ({client, subscriptionData: {data: {radioMediaItemUpdated}}}) => {

      console.log("radioMediaItemUpdated", radioMediaItemUpdated)

      let data = client.readQuery({query: RADIO_QUERY, variables: {radioId}})

      if(radioMediaItemUpdated.status === 'NOW_PLAYING'){
        enqueueSnackbar(`Now playing ${radioMediaItemUpdated.title}`)
        data.radio = {
          ...data.radio,
          itemsQueued: data.radio.itemsQueued.filter(mediaItem => mediaItem.id !== radioMediaItemUpdated.id),
          itemsPlayed: _.flatten([data.radio.itemsPlaying, ...data.radio.itemsPlayed]),
          itemsPlaying: [radioMediaItemUpdated]
        }
      }else if(radioMediaItemUpdated.status === 'PLAYED'){
        data.radio = {
          ...data.radio,
          itemsPlaying: data.radio.itemsPlaying.filter(mediaItem => mediaItem.id !== radioMediaItemUpdated.id),
          itemsPlayed: [radioMediaItemUpdated, ...data.radio.itemsPlayed],
          itemsQueued: data.radio.itemsQueued.filter(mediaItem => mediaItem.id !== radioMediaItemUpdated.id),
        }
      }

      client.writeQuery({query: RADIO_QUERY, variables: {radioId}, data})

    }
  })

  return (
    <SearchContext.Provider value={{querySearch, setQuerySearch}}>

      <RadioDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

      <Box>
        <SearchInputBase toggleDrawer={toggleDrawer} />

        {querySearch.length > 3 ? (
          <Search radioId={radioId} />
        ):(
          <React.Fragment>
            <Box className={classes.container}>
              <Query query={RADIO_QUERY} variables={{radioId}}>
                {({data, loading, error}) => {

                  if(loading){
                    return (
                      <Box display="flex" justifyContent="center" alignItems="center" alignContent="center">
                        <CircularProgress className={classes.progress}/>
                      </Box>
                    )
                  }

                  if(error){
                    return (
                      <div>Oppps... {error.message}</div>
                    )
                  }

                  let {radio, user} = data
                  user = {...user, isCreator: radio.createdBy.id === user.id}
                  const {itemsPlaying, itemsQueued, itemsPlayed, people} = radio

                  return (
                    <Switch>
                      <Route exact path={RADIO_TABS[0].url} component={() => <Playlist user={user} radioId={radioId} itemsPlaying={itemsPlaying} itemsQueued={itemsQueued} />}/>
                      <Route exact path={RADIO_TABS[1].url} component={() => <Playlist user={user} radioId={radioId} itemsPlayed={itemsPlayed} />}/>
                      <Route exact path={RADIO_TABS[2].url} component={() => <People user={user} people={people} />}/>
                      <Route exact path={RADIO_TABS[3].url} component={() => <Info user={user} radio={data.radio} />}/>
                    </Switch>
                  )
                }}
              </Query>
            </Box>
            <AppBar position="fixed" color="primary" className={classes.bottomNavigationAppBar}>
              <BottomNavigation
                value={RADIO_TABS.map(t => t.url).indexOf(history.location.pathname)}
                showLabels
                className={classes.root} >

                {RADIO_TABS.map(tab => (
                  <BottomNavigationAction
                    key={tab.label}
                    label={tab.label}
                    icon={tab.icon}
                    component={Link}
                    to={tab.url} />
                ))}
              </BottomNavigation>
            </AppBar>
          </React.Fragment>
        )}
      </Box>
    </SearchContext.Provider>
  )
}

export default withRouter(Radio)