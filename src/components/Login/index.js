import React, {useEffect} from 'react'
import {useApolloClient, useMutation} from 'react-apollo-hooks'
import {AUTH_TOKEN} from "../../constants"
import {withRouter} from "react-router"
import {SIGNUP_MUTATION} from "../../graphql"

function Login({location, history}) {

  const client = useApolloClient()
  let redirectTo = '/join'
  if (location.state && location.state.hasOwnProperty('from')){
    redirectTo = location.state.from.pathname
  }

  const [mutation, {error, data}] = useMutation(SIGNUP_MUTATION)

  useEffect(() => {
    if (data) {
      const {token, user} = data.anonymousSignup
      localStorage.setItem(AUTH_TOKEN, token)
      client.writeData({
        data: {
          isLoggedIn: true,
          user: user
        }
      })
      history.push(redirectTo)
    }
  }, [data])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem(AUTH_TOKEN)
    if(isLoggedIn){
      history.push(redirectTo)
    }else{
      mutation()
    }
  }, [history, mutation])

  return (
    <div>
      Anonymous login... {error && <p>{error.message}</p>}
    </div>
  )
}

export default withRouter(Login)