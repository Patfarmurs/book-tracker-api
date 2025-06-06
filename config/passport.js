const  passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;


passport.deserializeUser((obj, done) => {
    done(null, obj);
});
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.use(
new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'https://book-tracker-api-m2h1.onrender.com/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
        // Here you would typically find or create a user in your database
        // For this example, we'll just return the profile
        return done(null, profile);
    }
)
);