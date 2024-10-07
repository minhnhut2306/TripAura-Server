
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const dotenv = require('dotenv');
dotenv.config();


const clientID = process.env.CLIENT_ID_GOOGLE;
const clientSecret = process.env.CLIENT_SECRET_GOOGLE;
const callbackURL = 'http://localhost:3000/api/auth/google/callback';

passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL,
},
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        return (done(null, profile))
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport