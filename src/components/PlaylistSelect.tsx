import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { Playlist } from '../types';
const useStyles = makeStyles((theme: ThemeOptions) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      // @ts-ignore
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      // @ts-ignore
      marginTop: theme.spacing(2),
    },
  }));
export default (props: {
    playlists: Array<Playlist>,
    selectedPlaylist: string,
    onChange: (e: any) => void
}) => {
    const classes = useStyles(props);

    return (
        <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="playlist">Playlist</InputLabel>
                <Select value={props.selectedPlaylist} onChange={props.onChange} style={{width: '350px', margin: '0 auto'}}>
                    {
                        props.playlists.length
                          ? props.playlists.map(playlist => 
                              <MenuItem key={playlist.id} value={playlist.id}>{playlist.name}</MenuItem>)
                          : <MenuItem value={"loading"}>Loading...</MenuItem>
                    }
                </Select>
            </FormControl>
        </form>
    )
}