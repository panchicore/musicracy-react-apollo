import React from "react"
import {List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core"
import PersonIcon from '@material-ui/icons/Person'
import {USER_NAME} from "../../../constants"


function People({people}){
  const me = localStorage.getItem(USER_NAME)
  return (
    <List component="nav" aria-label="main mailbox folders">
      {people.map(p => (
        <ListItem key={p.user.name}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary={p.user.name === me ? `${p.user.name} (me)` : p.user.name} />
        </ListItem>
      ))}
    </List>
  )
}

export default People