import React from "react"
import {Typography, Box, Button} from "@material-ui/core"

function Info({radio, user}){

  const _goToPlayer = () => {
    window.open(`/player/${radio.id}`, '_blank')
  }

  return (
    <Box m={2} p={2}>
      <Typography>I am {user.name}</Typography>
      <Typography>This radio is {radio.hash}</Typography>
      <Typography>Created by {radio.createdBy.name}</Typography>

      {user.isCreator &&
      <Button
        variant="outlined" color="primary"
        onClick={_goToPlayer}>Open player</Button>
      }
    </Box>
  )
}

export default Info