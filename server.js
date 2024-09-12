// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const movies = require('./db/queries/movies')

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');
const addMovieRoutes = require('./routes/addMovie')
const moviesRoutes = require('./routes/movies');
const favouritesRoutes = require('./routes/favourites');
 // const { getAllMovies } = require('./db/queries/movies');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);
app.use('/addMovie', addMovieRoutes);
app.use('/movies', moviesRoutes);
app.use('/favourites', favouritesRoutes)
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  // Fetch all movies in database
  movies.getAllMovies()
    .then(moviesData => {
      const templateVars = {
        cookie: req.cookies, // Store cookie information in templateVars
        movies: moviesData, // Store movie database information in templateVars
      };
      res.render('index', templateVars)
    })
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
