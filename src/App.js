import React from 'react'
import {Route, Switch} from 'react-router'
import Login from "./components/Login"
import Join from "./components/Join"
import Radio from "./components/Radio"
import {CssBaseline} from "@material-ui/core"
import {SnackbarProvider} from 'notistack'
import Player from "./components/Player"
import CreateRadio from "./components/CreateRadio"
import {PrivateRoute} from "./utils"


function App() {
  return (
    <SnackbarProvider maxSnack={1}>

        <CssBaseline/>
        <Switch>
          <Route exact path="/" component={Login}/>
          <PrivateRoute exact path="/start" component={CreateRadio} />
          <PrivateRoute exact path="/join" component={Join}/>
          <PrivateRoute exact path="/radio" component={Radio}/>
          <PrivateRoute exact path="/radio/:tabId" component={Radio}/>
          <PrivateRoute exact path="/player/:radioId" component={Player}/>
        </Switch>

    </SnackbarProvider>
  )
}

export default App
