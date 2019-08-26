import React, {useState, useEffect} from "react"
import {withRouter} from "react-router"
import {Box, Button, Container, TextField, Typography} from "@material-ui/core"
import {CONNECT_RADIO_MUTATION, USER_QUERY} from "../../graphql"
import {Mutation, Query} from "react-apollo"
import {CURRENT_RADIO_ID} from "../../constants"
import {useSnackbar} from "notistack"

function Join({history, match}){

  const { enqueueSnackbar } = useSnackbar()
  const [hash, setHash] = useState('')
  const [error, setError] = useState(null)

  const onRadioConnect = ({connectToRadio}) => {
    localStorage.setItem(CURRENT_RADIO_ID, connectToRadio.id)
    history.push('/radio')
  }

  useEffect(() => {
    if(match.params.radioId){
      setHash(match.params.radioId)
    }
  }, [])

  useEffect(() => {
    if(error){
      error.graphQLErrors.map(err => enqueueSnackbar(err.message, {variant: 'error'}))

    }
  }, [error])

  return(
    <Container maxWidth="sm">

      <Query query={USER_QUERY}>
        {({data: {user}}) => {
          return (
            <Box display="flex" justifyContent="center" m={3}>
              <Typography variant={'h3'}>Hi {user && user.name}!</Typography>
            </Box>
          )
        }}
      </Query>

      <Box m={1}>
        <TextField
          id="outlined-name"
          label="Radio"
          value={hash}
          onChange={event => setHash(event.target.value)}
          margin="normal"
          variant="outlined"
          fullWidth
          required
        />
      </Box>

      <Box m={1}>
        <Mutation
          mutation={CONNECT_RADIO_MUTATION}
          variables={{hash: hash}}
          onCompleted={onRadioConnect}
          onError={(error) => setError(error)} >
          {(connectToRadioMutation, {loading, error, data}) => (
            <Button variant="contained" color="primary" onClick={connectToRadioMutation} fullWidth>
              {loading ? 'Connecting...': 'Join now'}
            </Button>
          )}
        </Mutation>
      </Box>

      <Box m={1}>
        <Button variant={"outlined"} onClick={() => history.push('/start')} fullWidth>
          Or create a radio
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" m={3}>
        <Typography variant={'h3'}>Recover your music</Typography>
      </Box>

      <Box>
        <Button variant="contained" color="primary" onClick={() => {}} fullWidth>
          Login
        </Button>
      </Box>


    </Container>
  )
}

export default withRouter(Join)