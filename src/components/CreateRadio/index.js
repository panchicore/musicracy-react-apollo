import React, {useEffect, useState} from "react"
import {AUTH_TOKEN, CURRENT_RADIO_ID} from "../../constants"
import {withRouter} from "react-router"
import {Box, Button, Container, TextField, Typography} from "@material-ui/core"
import Mutation from "react-apollo/Mutation"
import {CREATE_RADIO_MUTATION} from "../../graphql/mutations"
import {useSnackbar} from "notistack"

function CreateRadio({history}){

  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const {enqueueSnackbar} = useSnackbar()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem(AUTH_TOKEN)
    if(!isLoggedIn){
      history.push('/?next=/start')
    }
  }, [history])

  const onRadioCreated = ({createRadio}) => {
    localStorage.setItem(CURRENT_RADIO_ID, createRadio.id)
    history.push('/radio/info')
  }

  if (error){
    enqueueSnackbar(error, {variant: 'error'})
  }

  return (
    <Container maxWidth="sm">

      <Box display="flex" justifyContent="center" m={3}>
        <Typography variant="h3">
          Create a Radio
        </Typography>
      </Box>

      <Box>

        <TextField
          id="standard-name"
          label="Name"
          value={name}
          onChange={event => setName(event.target.value)}
          margin="normal"
          variant="outlined"
          fullWidth
          required
        />
      </Box>

      <Box m={1}>
        <Mutation
          mutation={CREATE_RADIO_MUTATION}
          variables={{name}}
          onCompleted={onRadioCreated}
          onError={(error) => setError(error.message)}
        >
          {(createRadioMutation, {loading, error, data}) => (
            <Button
              variant="contained"
              color="primary"
              disabled={loading === true}
              onClick={createRadioMutation}
              fullWidth
            >
              {loading ? 'Creating...':'Create and join'}
            </Button>
          )}
        </Mutation>
      </Box>

      <Box m={1}>
        <Button
          onClick={() => history.goBack()}
          variant="clear"
          fullWidth
        >
          or Cancel
        </Button>
      </Box>

    </Container>
  )
}

export default withRouter(CreateRadio)