const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
require('dotenv').config();
require('./config/passport');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');
const db = require('./data/database');
const routes = require('./routes');
const cors = require('cors');


dotenv.config();
const app = express();

app.use(express.json());




app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/',routes);



app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: 'none',
    },
  })
);


app.use(cors({
  origin: '',
  credentials: true
}));


app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
  res.send(`<h1>Welcome</h1><a href="/auth/google">Login with Google</a>`);
});

// Google Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/profile'
  })
);

// Protected Route
app.get('/profile', ensureAuthenticated, (req, res) => {
  res.send(`<h1>Hello, ${req.user.displayName}</h1><a href="/logout">Logout</a>`);
});

// Logout
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Middleware to check authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}


app.get('/', (req, res) => {
    res.send('Welcome to the Book Review API');
});



app.use('/', require('./routes/index'));

const port = process.env.PORT || 3000;

db.initdb((err) => {
    if (err) {
        console.error(err);
    } else {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
});