import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@material-ui/core';

import TopBar from './components/TopBar';
import PlaylistSelect from './components/PlaylistSelect';
import RadarChart from './components/RadarChart';
import Grid from './components/Grid';

import { Playlist, Song } from './types';

import { getPlaylists, getPlaylistAverageAudioFeatures, getPlaylistTracksAudioFeatures } from './utils/spotify';
import useWindowSize from './utils/useWindowSize';

const App: React.FC = (props) => {

  const [playlists, setPlaylists] = useState<Array<Playlist>>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [songs, setSongs] = useState<Array<Song>>([]);

  const [playlistData, setPlaylistData] = useState({
    danceability: 0,
    energy: 0,
    speechiness: 0,
    acousticness: 0,
    instrumentalness: 0,
    liveness: 0,
    valence: 0
  });

  const [loadingPlaylist, setLoadingPlaylist] = useState(true);
  const [loadingSongs, setLoadingSongs] = useState(true);

  const size = useWindowSize();

  const fetchPlaylists = async () => {
    const newPlaylists = await getPlaylists();
    setPlaylists(newPlaylists);
    setSelectedPlaylist(newPlaylists[0].id);
  }

  const getPlaylistAudioFeatures = async (id: string) => {
    setLoadingPlaylist(true)
    setPlaylistData(await getPlaylistAverageAudioFeatures(id));
    setLoadingPlaylist(false);
  }

  const getPlaylistTrackAudioFeatures = async (id: string) => {
    setLoadingSongs(true)
    setSongs(await getPlaylistTracksAudioFeatures(id));
    setLoadingSongs(false);
  }

  useEffect(() => {
    fetchPlaylists();
  }, [])

  useEffect(() => {
    getPlaylistAudioFeatures(selectedPlaylist);
    getPlaylistTrackAudioFeatures(selectedPlaylist);
  }, [selectedPlaylist])


  const playlist = playlists.find(p => p.id === selectedPlaylist) || { name: 'Loading' };
  const dummyData = [];

  for (let i = 0; i < Math.floor((size.width | 350) / 350); i++) {
    dummyData.push({
      name: "Loading",
      artists: [
        {
          name: "Loading..."
        }
      ],
      audio_features: {
        danceability: 0,
        instrumentalness: 0,
        acousticness: 0,
        valence: 0,
        energy: 0,
        speechiness: 0
      }
    })
  }

  return (
    <div className="App" style={{ textAlign: 'center', margin: '' }}>
      <TopBar />
      <div style={{ margin: '20px' }}>
        <Paper style={{ padding: '20px 0 0 0' }}>
          <Typography variant="h3">Playlist</Typography>
          <div style={{ margin: '0 auto', width: '350px' }}>
            <PlaylistSelect selectedPlaylist={selectedPlaylist} playlists={playlists} onChange={(e: any) => { setSelectedPlaylist(e.target.value) }} />
          </div>
          {
            loadingPlaylist ?
              // @ts-ignore
              <RadarChart name="Loading" data={{
                danceability: 0,
                instrumentalness: 0,
                acousticness: 0,
                valence: 0,
                energy: 0,
                speechiness: 0
              }} margin={50} size={175} /> :
              <RadarChart name={playlist.name} data={playlistData} margin={50} size={175} />
          }

        </Paper>

        <Typography variant="h3" style={{ margin: '20px 0 20px 0' }}>Songs</Typography>

        {!loadingSongs ?
          <Grid songs={songs} columns={Math.floor((size.width | 350) / 350)}></Grid> :
          <Grid songs={dummyData} columns={Math.floor((size.width | 350) / 350)}></Grid>
        }

      </div>
    </div>
  );
}

export default App;
