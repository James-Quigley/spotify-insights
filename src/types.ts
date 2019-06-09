import { AxiosInstance } from 'axios';

declare global {
    interface Window { axios: AxiosInstance; }
}

export interface Playlist {
    id: string,
    name: string
}

export interface Song {
    id: string,
    name: string,
    artists: Array<Artist>,
    audio_features: AudioFeatures,
    uri: string
}

export interface AudioFeatures {
    danceability: number,
    energy: number,
    speechiness: number,
    acousticness: number,
    instrumentalness: number,
    liveness: number,
    valence: number,
    [key:string]: number
}

export interface Artist {
    name: string,
    uri: string
}