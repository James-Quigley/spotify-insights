const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express')
const next = require('next')
const OAuth2Strategy = require('passport-oauth2');
const passport = require('passport');
const session = require('express-session');
const axios = require('axios').default;

const dev = process.env.NODE_ENV !== 'production'

if (dev){
  require('dotenv').config()
}
const app = next({ dev })
const handle = app.getRequestHandler()

const users = {};

const strategy = new OAuth2Strategy({
  authorizationURL: process.env.AUTHORIZATION_URL,
  tokenURL: process.env.TOKEN_URL,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  scope: 'user-library-read playlist-read-private playlist-read-collaborative',
//   scopeSeparator: encodeURIComponent(' ')
}, function(accessToken, refreshToken, profile, cb) {
  if (!users[accessToken]){
    users[accessToken] = accessToken
  }
  cb(null, accessToken);
});

passport.serializeUser(function (accessToken, done) {
  done(null, accessToken);
});

passport.deserializeUser(function (accessToken, done) {
  done(null, accessToken);
});

app.prepare()
.then(() => {
  const server = express()

  server.use(bodyParser.json());
  server.use(cookieParser());

  server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {}
  }));

  passport.use(strategy);
  server.use(passport.initialize());
  server.use(passport.session());
  
  server.get('/auth/login', passport.authenticate('oauth2'));

  server.get('/auth/callback', (req, res, next) => {
    next();
  }, passport.authenticate('oauth2', { failureRedirect: '/auth/login', successRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    });
  
  server.get('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err){
        console.error("Failed to destroy session", err);
      }
      req.logOut();
      res.clearCookie('user_sid');
      res.redirect('/');
    });
  });

  server.get('/api/ping', (req, res) => {
      res.sendStatus(req.user ? 200 : 401);
  });

  server.get('/api/playlists', (req, res) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }
    axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': `Bearer ${req.user}`
      }
    }).then(({data}) => {
      res.status(200).send(data.items);
    }).catch(() => {
      res.sendStatus(500);
    });
  });

  server.get('/api/playlist/:id/audio_features', (req, res) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }
    axios.get(`https://api.spotify.com/v1/playlists/${req.params.id}/tracks`, {
      headers: {
        'Authorization': `Bearer ${req.user}`
      }
    }).then(({data}) => {
      let trackIds = data.items.filter(song => Object.keys(song).includes('track')).map(song => song.track.id);
      return axios.get(`https://api.spotify.com/v1/audio-features?ids=${trackIds.slice(0, 100).join(',')}`, {
        headers: {
          'Authorization': `Bearer ${req.user}`
        }
      })
    }).then(({data}) => {
      const keys = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence'];
      const stat_totals = data.audio_features.filter(track => {
        for (let key of keys) {
          if (track[key] === undefined || track[key] === null){
            return false;
          }
        }
        return true;
      }).reduce((sums, track_features) => {
        const keys = Object.keys(sums);
        for (let key of keys){
          sums[key] += track_features[key];
        }
        return sums;
      }, {
        danceability: 0,
        energy: 0,
        speechiness: 0,
        acousticness: 0,
        instrumentalness: 0,
        liveness: 0,
        valence: 0
      });

      const stats_avg = {
        danceability: stat_totals['danceability'] / data.audio_features.length,
        energy: stat_totals['energy'] / data.audio_features.length,
        speechiness: stat_totals['speechiness'] / data.audio_features.length,
        acousticness: stat_totals['acousticness'] / data.audio_features.length,
        instrumentalness: stat_totals['instrumentalness'] / data.audio_features.length,
        liveness: stat_totals['liveness'] / data.audio_features.length,
        valence: stat_totals['valence'] / data.audio_features.length
      };
    
      res.status(200).send(stats_avg);
    })
    .catch((err) => {
      console.error("Uh oh", err);
      res.sendStatus(500);
    });
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.use((err, req, res, next) => {
    console.log("ERROR", err);
    next(err);
  })
    
  server.listen(8080, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:8080')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
