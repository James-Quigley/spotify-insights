import { AxiosInstance } from 'axios';

import { AudioFeatures, Song, Playlist } from '../types';

declare global {
    interface Window { axios: AxiosInstance; }
}

const keys = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence'];

export const getPlaylists = async (): Promise<Array<Playlist>> => {
    return (await window.axios.get('/me/playlists')).data.items;
}

export const getPlaylistAverageAudioFeatures = async (id: string): Promise<AudioFeatures> => {

    const statsDefault : {[key:string]: number} =  {
        danceability: 0,
        energy: 0,
        speechiness: 0,
        acousticness: 0,
        instrumentalness: 0,
        liveness: 0,
        valence: 0
      }

    const songs = await getPlaylistTracksAudioFeatures(id);
    const stat_totals = songs.reduce((sums, { audio_features }) => {
        for (let key of keys){
          sums[key] += audio_features[key];
        }
        return sums;
      }, statsDefault);

      const stats_avg = {
        danceability: stat_totals['danceability'] / songs.length,
        energy: stat_totals['energy'] / songs.length,
        speechiness: stat_totals['speechiness'] / songs.length,
        acousticness: stat_totals['acousticness'] / songs.length,
        instrumentalness: stat_totals['instrumentalness'] / songs.length,
        liveness: stat_totals['liveness'] / songs.length,
        valence: stat_totals['valence'] / songs.length
      };
      return stats_avg;
}

export const getPlaylistTracksAudioFeatures = async (id: string): Promise<Array<Song>> => {
    const songs = (await window.axios.get(`playlists/${id}/tracks`)).data.items;
    let tracks = songs.filter((song: any) => Object.keys(song).includes('track')).slice(0, 100).map((song: any) => song.track);
    const response = await window.axios.get(`audio-features?ids=${tracks.map((track: any) => track.id).join(',')}`);
    for (let i = 0; i < tracks.length; i++){
        tracks[i].audio_features = response.data.audio_features[i];
    }
    const keys = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence'];
    
    const typedTracks: Array<Song> = tracks;
    typedTracks.filter((track: Song) => {
        for (let key of keys) {
            if (track.audio_features[key] === undefined || track.audio_features[key] === null){
                return false;
            }
        }
        return true;
    }).map(({ id, name, audio_features, artists, uri}) => ({
        id,
        name,
        audio_features,
        artists,
        uri
    }));

    return tracks;
}