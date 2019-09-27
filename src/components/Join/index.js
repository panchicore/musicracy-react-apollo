import React, {useEffect, useState} from "react"
import {withRouter} from "react-router"
import {Box, Button, Container, TextField, Typography} from "@material-ui/core"
import {CONNECT_RADIO_MUTATION, USER_QUERY} from "../../graphql"
import {CURRENT_RADIO_ID} from "../../constants"
import {useSnackbar} from "notistack"
import {useMutation, useQuery} from "react-apollo-hooks"

function GreetUser(){
  const {data, loading} = useQuery(USER_QUERY)
  if (loading) return null
  return <Typography variant={'h3'}>Hi {data.user.name}!</Typography>
}

function Join({history, match}){

  const { enqueueSnackbar } = useSnackbar()
  const [hash, setHash] = useState('')

  const [requestRadio, {data, loading, error}] = useMutation(CONNECT_RADIO_MUTATION, {
    variables: {hash}
  })

  useEffect(() => {
    if(match.params.radioId){
      setHash(match.params.radioId)
    }
  }, [match.params])

  useEffect(() => {
    if(data){
      const {connectToRadio} = data
      localStorage.setItem(CURRENT_RADIO_ID, connectToRadio.id)
      history.push('/radio')
    }
    if(error){
      error.graphQLErrors.map(e => enqueueSnackbar(e.message, {variant: 'error'}))
    }
  }, [data, error])

  return(
    <Container maxWidth="sm">

      <Box display="flex" justifyContent="center" m={3}>
        <GreetUser />
      </Box>

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
        <Button variant="contained" color="primary" onClick={requestRadio} fullWidth>
          {loading ? 'Connecting...': 'Join now'}
        </Button>
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