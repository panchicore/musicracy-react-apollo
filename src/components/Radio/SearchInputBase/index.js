import React, {useContext, useState} from 'react'
import {Divider, IconButton, InputBase, makeStyles, Paper} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'
import TvIcon from '@material-ui/icons/Tv'
import {SearchContext} from "../contexts"

const useStyles = makeStyles({
  root: {
    margin: '10px',
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
})

export default function SearchInputBase({toggleDrawer}) {
  const classes = useStyles()

  const searchContext = useContext(SearchContext)
  const [q, setQ] = useState(searchContext.querySearch)

  const executeSearch = () => {
    searchContext.setQuerySearch(q)
  }

  const clearSearch = () => {
    setQ('')
    searchContext.setQuerySearch('')
  }

  return (
    <Paper className={classes.root}>
      <IconButton className={classes.iconButton} aria-label="menu" onClick={toggleDrawer}>
        <MenuIcon/>
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Send to this radio"
        inputProps={{'aria-label': 'send to this radio'}}
        value={q}
        onChange={event => setQ(event.target.value)}
        onKeyPress={event => {
          if(event.key === 'Enter'){
            executeSearch()
          }
        }}
      />

      {searchContext.querySearch.length > 0 &&
      <IconButton className={classes.iconButton} aria-label="clear" onClick={clearSearch}>
        <CloseIcon />
      </IconButton>
      }
      <IconButton className={classes.iconButton} aria-label="search" onClick={executeSearch}>
        <SearchIcon />
      </IconButton>
      <Divider className={classes.divider}/>
      <IconButton color="primary" className={classes.iconButton} aria-label="directions">
        <TvIcon/>
      </IconButton>
    </Paper>
  )
}