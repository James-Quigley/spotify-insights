import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
import Head from 'next/head';
import RadarChart from '../components/RadarChart';
import Grid from '../components/Grid';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme';
import { Typography, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

function useWindowSize() {
  const isClient = typeof window === 'object';
  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }
  const [windowSize, setWindowSize] = useState(getSize);
  useEffect(() => {
    if (!isClient) {
      return false;
    }
    function handleResize() {
      setWindowSize(getSize());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return windowSize;
}

const useStyles = makeStyles(theme => ({}));

const Index = () => {
  const classes = useStyles();
  const size = useWindowSize();
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [songs, setSongs] = useState([]);
  const [playlistData, setPlaylistData] = useState({
    danceability: 0,
    energy: 0,
    speechiness: 0,
    acousticness: 0,
    instrumentalness: 0,
    liveness: 0,
    valence: 0
  });
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [loadingPlaylist, setLoadingPlaylist] = useState(true);
  const [loadingSongs, setLoadingSongs] = useState(true);

  const getPlaylists = async () => {
    setLoadingPlaylists(true);
    axios.get('/api/playlists', {
      withCredentials: true
    }).then(({ data }) => {
      setPlaylists(data);
      setSelectedPlaylist(data[0].id);
      setLoadingPlaylists(false);
    }).catch(err => {
      console.log("Error getting playlists:", err);
      Router.push('/auth/login');
    });
  }

  const getPlaylistAudioFeatures = (id) => {
    if (!id) {
      return;
    }
    setLoadingPlaylist(true)
    axios.get(`/api/playlist/${id}/audio_features/avg`, {
      withCredentials: true
    }).then(({ data }) => {
      setPlaylistData(data);
      setLoadingPlaylist(false);
    }).catch(err => {
      console.log("Error getting playlists features:", err);
      Router.push('/auth/login');
    });
  }

  const getPlaylistTrackAudioFeatures = (id) => {
    if (!id) {
      return;
    }
    setLoadingSongs(true)
    axios.get(`/api/playlist/${id}/audio_features`, {
      withCredentials: true
    }).then(({ data }) => {
      setSongs(data);
      setLoadingSongs(false);
    }).catch(err => {
      console.log("Error getting playlists features:", err);
      Router.push('/auth/login');
    });
  }

  useEffect(() => {
    getPlaylists();
  }, [])

  useEffect(() => {
    getPlaylistAudioFeatures(selectedPlaylist);
    getPlaylistTrackAudioFeatures(selectedPlaylist);
  }, [selectedPlaylist])

  const playlist = playlists.find(p => p.id === selectedPlaylist);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline>
        <div style={{
          textAlign: 'center',
          margin: '10px'
        }}>
          <Head>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
            />
            <meta charSet="utf-8" />
            <style jsx global>{`
              body { 
                background-color: #121212;
                font: 10px Arial;
                color: #fff;
              }
            `}</style>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap" />
          </Head>
          <Typography component="h1">Playlists</Typography>
          {/* <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="playlist">Playlist</InputLabel>
              <Select value={playlist ? playlist.name : 'Loading...'} onChange={(e) => setSelectedPlaylist(e.target.value)} inputProps={{
                name: 'playlist',
                id: 'playlist',
              }}>
                {
                  (!loadingPlaylists) ?
                    playlists.map(playlist => <MenuItem key={playlist.id} value={playlist.id}>{playlist.name}</MenuItem>) :
                    <MenuItem key="null" value={'null'}>Loading...</MenuItem>
                }
              </Select>
            </FormControl>
          </form> */}
          <select onChange={(e) => setSelectedPlaylist(e.target.value)}>
            {
              !loadingPlaylists ?
                playlists.map(playlist => <option key={playlist.id} value={playlist.id}>{playlist.name}</option>) :
                <option key="null" value={'null'}>Loading...</option>
            }
          </select>
          <Typography component="h2">Playlist</Typography>
          {
            (!loadingPlaylist && playlist) ?
              <RadarChart name={playlist.name} data={playlistData} size={200} margin={50}></RadarChart> : ''
          }
          <Typography component="h2">Songs</Typography>

          {!loadingSongs ?
            <Grid songs={songs} columns={Math.floor((size.width | 350) / 350)}></Grid> :
            ''
          }
        </div>
      </CssBaseline>
    </MuiThemeProvider>
  )
}

export default Index;
