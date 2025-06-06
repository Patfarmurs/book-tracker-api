require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');
const db = require('./data/database');


require('./config/passport'); 

const app = express();
app.use(express.json());


app.use(cors({
  origin: 'https://book-tracker-api-m2h1.onrender.com',
  credentials: true
}));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,       
    sameSite: 'lax'      
  }
}));


app.use(passport.initialize());
app.use(passport.session());


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));


app.get('/auth/github',
  passport.authenticate('github', { scope: ['profile', 'email'] })
);

app.get('/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/',
    successRedirect: '/profile'
  })
);


app.get('/profile', ensureAuthenticated, (req, res) => {
  res.send(`<h1>Welcome to the Book Review API, ${req.user.displayName}</h1><a href="/logout">Logout</a>`);
});


app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});


app.get('/', (req, res) => {
  res.send(`<h1>Welcome to the Book Review API</h1><a href="/auth/github">Login with GitHub</a>`);
});


app.use('/', require('./routes/index'));


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}


const port = process.env.PORT || 3000;
db.initdb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log(` Server is running on port ${port}`);
    });
  }
});
