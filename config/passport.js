const  passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.deserializeUser((obj, done) => {
    done(null, obj);
});
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.use(
new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'https://book-tracker-api-m2h1.onrender.com/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
        // Here you would typically find or create a user in your database
        // For this example, we'll just return the profile
        return done(null, profile);
    }
)
);