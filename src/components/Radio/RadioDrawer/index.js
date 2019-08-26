import React, {useContext} from "react"
import {Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, makeStyles} from "@material-ui/core"
import {withRouter} from "react-router"
import {RadioContext} from "../contexts"
import {RADIO_JOIN_URL} from "../../../constants"
import {useApolloClient} from "react-apollo-hooks"


const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

function RadioDrawer({isDrawerOpen, toggleDrawer, history}){

  const classes = useStyles()
  const client = useApolloClient()

  const exitRadio = () => {
    client.writeData({data: {currentRadio: null}})
    history.push(RADIO_JOIN_URL.replace("/:radioId", ""))
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

            <ListItem button>
              <ListItemText primary='Login or register' secondary='Recover your songs' />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Exit radio' onClick={exitRadio} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Create my own radio' />
            </ListItem>



        </List>
        {/*<Divider />*/}

      </div>
    </Drawer>
  )
}

export default withRouter(RadioDrawer)