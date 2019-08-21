import {useSnackbar} from "notistack"
import {useQuery} from "react-apollo-hooks"
import {SEARCH_MEDIA_QUERY} from "../../../../graphql"
import {SEARCH_RELATED_TO_TAG} from "../../../../constants"
import {Avatar} from "@material-ui/core"
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty"
import React from "react"

/**
 * @return {null}
 */
export function AvatarSearchRelated({radioId, item, onSearchRelatedResults}){
  const {enqueueSnackbar} = useSnackbar()
  const {error, data} = useQuery(SEARCH_MEDIA_QUERY, {
    variables: {radioId, filter: `${SEARCH_RELATED_TO_TAG} ${item.id}`},
    fetchPolicy: 'network-only'
  })

  if (error){
    enqueueSnackbar(error.message, {variant: 'error'})
    onSearchRelatedResults([])
    return null
  }

  if(data){
    onSearchRelatedResults(
      data["searchMedia"].map(d => ({...d, depth: item.depth + 1}))
    )
    return null
  }

  return (
    <Avatar>
      <HourglassEmptyIcon />
    </Avatar>
  )
}