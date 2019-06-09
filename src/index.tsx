import axios from 'axios';

import React from 'react';
import ReactDOM from 'react-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';

import App from './App';
import theme from './theme';

const hash: { [key: string]: string | null } = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial: { [key: string]: string }, item) {
        if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
window.location.hash = '';

const authEndpoint = 'https://accounts.spotify.com/authorize';

const clientId = '5b649a51cbeb427e95f982898dc1054b';
const redirectUri = process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://spotify-insights.now.sh';
const scopes = [
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative'
];

const createAxios = (token: string) => {
    window.axios = axios.create({
        baseURL: `https://api.spotify.com/v1/`,
        headers: {
            Authorization: `Bearer ${token}`
        },
    });

    // @ts-ignore
    window.axios.interceptors.response.use(null, (error: any) => {
        if (error.status === 401) {
            // @ts-ignore
            window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
        }
        return Promise.reject(error);
    });
}

if (!hash.access_token) {

    const access_token = window.localStorage.getItem('access_token');
    const expires_in = window.localStorage.getItem('expires_in');
    const date = window.localStorage.getItem('date');

    if (!access_token || !date || !expires_in || (parseInt(date) + parseInt(expires_in) < Date.now())) {
        // @ts-ignore
        window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
    } else {
        console.log("Got from localStorage");
        createAxios(access_token);
    }
} else {
    const { access_token, expires_in } = hash;
    window.localStorage.setItem('access_token', access_token);
    window.localStorage.setItem('expires_in', expires_in || '0');
    window.localStorage.setItem('date', Date.now() + '');
    createAxios(access_token);
}

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        {window.axios && <App /> }
    </ThemeProvider>
    , document.getElementById('root'));
