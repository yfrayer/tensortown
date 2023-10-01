const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./middleware/passport');
const login = require('./routes/login');
const pg = require('pg');
require('dotenv').config();

const pool = new pg.Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASS,
  database: process.env.PGDATABASE
});

const io = require('socket.io')(server);

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.BASEURL,
  credentials: true,
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', process.env.BASEURL);
  next();
});

var sessionMiddleware = session({
  store: new (require('connect-pg-simple')(session))({
    pool: pool
  }),
  secret: process.env.COOKIESECRET,
  saveUninitialized: false,
  resave: false,
  cookie: { 
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/login', login);

io.use(function(socket, next) {
  sessionMiddleware(socket.request, {}, next);
});

const chatio = require('./middleware/io');
chatio.set(io);

server.listen(3001, () => {
  console.log('listening on *:3001');
});
