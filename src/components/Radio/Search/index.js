import React, {useContext} from "react"
import {useQuery} from "react-apollo-hooks"
import {SEARCH_MEDIA_QUERY} from "../../../graphql"
import {Box, CircularProgress, List, makeStyles} from "@material-ui/core"
import {useSnackbar} from "notistack"
import {SearchContext} from "../contexts"
import {SearchResultItem} from "./SearchResultItem"

const useStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2),
  }
}))

/**
 * @return {null}
 */
function Search({radioId}) {

  const classes = useStyles()
  const searchContext = useContext(SearchContext)
  const variables = {radioId, filter: searchContext.querySearch}
  const {enqueueSnackbar} = useSnackbar()

  const {loading, error, data} = useQuery(SEARCH_MEDIA_QUERY, {
    variables,
    fetchPolicy: 'network-only'
  })

  if (loading) {
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
    <List dense={false} component="nav">
      {data["searchMedia"].map(item => ({...item, depth: 0})).map((item, index) =>
        <SearchResultItem
          searchMedia={data["searchMedia"]}
          key={index}
          radioId={radioId}
          item={item} />
      )}
    </List>
  )
}

export default Search