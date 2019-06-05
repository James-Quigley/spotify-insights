import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
import Head from 'next/head';
import RadarChart from '../components/RadarChart';

const Index = () => {

  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [playlistData, setPlaylistData] = useState({
    danceability: 0,
    energy: 0,
    speechiness: 0,
    acousticness: 0,
    instrumentalness: 0,
    liveness: 0
  });

  const getPlaylists = async () => {
    axios.get('/api/playlists', {
      withCredentials: true
    }).then(({ data }) => {
      setPlaylists(data);
      setSelectedPlaylist(data[0].id);
    }).catch(err => {
      console.log("Error getting playlists:", err);
      Router.push('/auth/login');
    });
  }

  const getPlaylistAudioFeatures = (id) => {
    if (!id){
      return;
    }
    axios.get(`/api/playlist/${id}/audio_features`, {
      withCredentials: true
    }).then(({data}) => {
      setPlaylistData(data);
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
  }, [selectedPlaylist])

  const playlist = playlists.find(p => p.id === selectedPlaylist);
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      {/* <h1>Playlists</h1> */}
      <select onChange={(e) => setSelectedPlaylist(e.target.value)}>
        {playlists.map(playlist => <option key={playlist.id} value={playlist.id}>{playlist.name}</option>)}
      </select>
      {
        playlist ? <RadarChart name={playlist.name} data={playlistData}></RadarChart> : ''
      }
    </div>
  )
}

export default Index;
