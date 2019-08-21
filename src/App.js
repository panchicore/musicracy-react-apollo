import React from 'react'
import {Redirect, Route, Switch} from 'react-router'
import Login from "./components/Login"
import Join from "./components/Join"
import Radio from "./components/Radio"
import {CssBaseline} from "@material-ui/core"
import {SnackbarProvider} from 'notistack'
import Player from "./components/Player"
import CreateRadio from "./components/CreateRadio"
import {AUTH_TOKEN, LOGIN_URL} from "./constants"

function PrivateRoute({component: Component, next, ...rest}) {
  const isAuthenticated = localStorage.getItem(AUTH_TOKEN)

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: LOGIN_URL,
              state: {from: props.location}
            }}
          />
        )
      }
    />
  )
}

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
