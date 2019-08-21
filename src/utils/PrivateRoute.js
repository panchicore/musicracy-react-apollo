import {AUTH_TOKEN, LOGIN_URL} from "../constants"
import {Redirect, Route} from "react-router"
import React from "react"

export const PrivateRoute = ({component: Component, next, ...rest}) => {
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