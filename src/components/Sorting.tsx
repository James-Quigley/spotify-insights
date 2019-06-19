import React from 'react';
import { FormControl, FormControlLabel, FormGroup, InputLabel, Select, Switch, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
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
    sortKey: string,
    setSortKey: (k: string) => void,
    sortAsc: boolean,
    setSortAsc: (s: boolean) => void
}) => {
    const classes = useStyles(props);

    const changeSortKey = (e: any) => {
        props.setSortKey(e.target.value);
    }

    const changeSortAsc = (e: any) => {
        props.setSortAsc(e.target.checked);
    }


    return (
        <div>
            <form className={classes.root} autoComplete="off">
                <FormGroup row>

                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="sorting">Sorting</InputLabel>
                        <Select value={props.sortKey} onChange={changeSortKey} style={{width: '350px', margin: '0 auto'}}>
                            <MenuItem value="acousticness">Acousticness</MenuItem>
                            <MenuItem value="danceability">Danceability</MenuItem>
                            <MenuItem value="energy">Energy</MenuItem>
                            <MenuItem value="instrumentalness">Instrumentalness</MenuItem>
                            <MenuItem value="liveness">Liveness</MenuItem>
                            <MenuItem value="valence">Valence</MenuItem>
                        </Select>
                        <div style={{width: '400px', margin: '0 auto'}}>
                            <FormControlLabel
                                control={
                                <Switch checked={props.sortAsc} onChange={changeSortAsc} value={props.sortAsc} />
                                }
                                label="Sort Direction"
                            />
                        </div>
                    </FormControl>
                </FormGroup>
            </form>

        </div>
    )
}