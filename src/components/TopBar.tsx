import React from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import GitHub from './GitHub';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

const useStyles = makeStyles((theme: ThemeOptions) => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        // @ts-ignore
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    }
}));

const TopBar: React.FC = (props: any) => {

    const classes = useStyles(props);

    return (
        <div className={classes.root} style={{ textAlign: 'left' }}>
            <AppBar position="static" color="default">
                <Toolbar>
                    <Typography variant="h6" color="inherit" className={classes.title}>
                        Spotify Insights
                    </Typography>
                    <IconButton
                        aria-label="GitHub"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <a style={{ color: "white" }} target="_blank" rel="noopener noreferrer" href="https://github.com/James-Quigley/spotify-insights"><GitHub /></a>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default TopBar;