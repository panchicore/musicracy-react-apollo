import React, {useEffect, useState} from "react"
import {AUTH_TOKEN, CURRENT_RADIO_ID} from "../../constants"
import {withRouter} from "react-router"
import {Box, TextField, Typography, Button, makeStyles} from "@material-ui/core"
import Mutation from "react-apollo/Mutation"
import {CREATE_RADIO_MUTATION} from "../../graphql/mutations"
import {useSnackbar} from "notistack"


const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  button: {
    margin: theme.spacing(1),
  }
}));

function CreateRadio({history}){

  const classes = useStyles()
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
    <Box>
      
      <Typography variant="h1" component="h2" gutterBottom>
        Create Radio
      </Typography>

      <Box>
        <TextField
          id="standard-name"
          label="Name"
          className={classes.textField}
          value={name}
          onChange={event => setName(event.target.value)}
          margin="normal"
        />
      </Box>

      <Box>
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
              className={classes.button}
              disabled={loading === true}
              onClick={createRadioMutation}
            >
              {loading ? 'Creating...':'Create'}
            </Button>
          )}
        </Mutation>
      </Box>

    </Box>
  )
}

export default withRouter(CreateRadio)