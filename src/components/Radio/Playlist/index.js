import React, {useRef} from "react"
import {makeStyles} from "@material-ui/core"
import {List, Typography, Box} from "@material-ui/core"
import PlaylistItem from "../PlaylistItem"

function PlaylistItemWrapper({user, radioId, items, mode}) {

  if(items.length > 0){
    return (
      <Box>
        <Box m={1}>
          {mode === 'NOW_PLAYING' && <Typography component="div">Now playing:</Typography>}
          {mode === 'QUEUED' && <Typography component="div">Next ({items.length} in queue)</Typography>}
        </Box>

        {items.map(item => (
          <PlaylistItem key={item.id}
                        user={user}
                        radioId={radioId}
                        item={item}
                        status={mode}/>
        ))}
      </Box>
    )
  }else{
    return (
      <Box m={1}>
        {mode === 'QUEUED' &&
          <Typography>Search and send music to this radio.</Typography>
        }
      </Box>
    )
  }


}

function Playlist({user, radioId, itemsPlaying, itemsQueued, itemsPlayed}) {



  return (
    <List>

      {itemsPlaying &&
        <PlaylistItemWrapper user={user} radioId={radioId} items={itemsPlaying} mode={'NOW_PLAYING'} />
      }

      {itemsQueued &&
        <PlaylistItemWrapper user={user} radioId={radioId} items={itemsQueued} mode={'QUEUED'} />
      }

      {itemsPlayed &&
        <PlaylistItemWrapper  user={user} radioId={radioId} items={itemsPlayed} mode={'PLAYED'} />
      }

    </List>
  )
}

export default Playlist