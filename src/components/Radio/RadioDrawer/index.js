import React from "react"
import {Drawer, List, ListItem, ListItemText, makeStyles} from "@material-ui/core"
import {withRouter} from "react-router"
import {CURRENT_RADIO_ID} from "../../../constants"

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

function RadioDrawer({isDrawerOpen, toggleDrawer, history}){

  const classes = useStyles()

  const exitRadio = () => {
    localStorage.removeItem(CURRENT_RADIO_ID)
    history.push('/join')
  }

  const createRadio = () => {
    localStorage.removeItem(CURRENT_RADIO_ID)
    history.push('/start')
  }

  return (
    <Drawer open={isDrawerOpen} onClose={toggleDrawer}>
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer}
        onKeyDown={toggleDrawer}
      >
        <List>
            <ListItem button disabled>
              <ListItemText primary='My Music' secondary='You always listen to them' />
            </ListItem>
            <ListItem button disabled>
              <ListItemText primary='Login or register' secondary='Enable my music' />
            </ListItem>

            <ListItem button>
              <ListItemText primary='Exit radio' onClick={exitRadio} />
            </ListItem>

            <ListItem button>
              <ListItemText primary='Create my own radio' onClick={createRadio} />
            </ListItem>

        </List>
        {/*<Divider />*/}

      </div>
    </Drawer>
  )
}

export default withRouter(RadioDrawer)