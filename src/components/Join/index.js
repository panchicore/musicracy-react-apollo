import React, {useState} from "react"
import {withRouter} from "react-router"
import {Box, Button, Container, TextField, Typography} from "@material-ui/core"
import {CONNECT_RADIO_MUTATION, USER_QUERY} from "../../graphql"
import {Mutation, Query} from "react-apollo"
import {CURRENT_RADIO_ID} from "../../constants"

function Join({history}){

  const [hash, setHash] = useState('')
  const [error, setError] = useState(null)

  const onRadioConnect = ({connectToRadio}) => {
    localStorage.setItem(CURRENT_RADIO_ID, connectToRadio.id)
    history.push('/radio')
  }

  return(
    <Container maxWidth="sm">

      <Query query={USER_QUERY}>
        {({data: {user}}) => {
          return (
            <Box>
              <Typography>Hi {user && user.name}!</Typography>
            </Box>
          )
        }}
      </Query>

      <Box>
        {error && <Typography>{error.message}</Typography>}
      </Box>

      <Box m={1}>
        <TextField
          id="outlined-name"
          label="Name"
          value={hash}
          onChange={event => setHash(event.target.value)}
          margin="normal"
          variant="outlined"
        />
      </Box>

      <Box m={1}>
        <Mutation
          mutation={CONNECT_RADIO_MUTATION}
          variables={{hash: hash}}
          onCompleted={onRadioConnect}
          onError={(error) => setError(error.message)} >
          {(connectToRadioMutation, {loading, error, data}) => (
            <Button variant="contained" onClick={connectToRadioMutation}>
              {loading ? 'Connecting...': 'Enter'}
            </Button>
          )}
        </Mutation>
      </Box>

      <Box m={1}>
        <Button variant={"outlined"} onClick={() => history.push('/start')}>
          Or create a radio
        </Button>
      </Box>


    </Container>
  )
}

export default withRouter(Join)