const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const Secret = require('./secret');
const User = require('../models/users');

passport.serializeUser(function (user, done) {
    done(null, user.id)
});

passport.deserializeUser(function (id, done) {
   // user.findOne({username:username}, function (err, user) {
  User.findOne(id, function (err, user) {
        done(err, user)

    })
});


passport.use(new FacebookStrategy(
    {
        clientID: Secret.facebook.clientID,
        clientSecret: Secret.facebook.clientSecret,
        callbackURL: Secret.facebook.callbackURL,
        profileFields: ["emails"]
        //"enable":true
    },
    function (token, refreshToken, profile, done) {
        User.findOne({facebook:profile.id}, function (err, user) {
            if(err)
            {
                return done(err);
            }
            if(user)
            {
                return done(null, user);
            }
            else
            {
                     const new_user = new User();
                     new_user.email = profile.emails[0].value;
                     new_user.profile.name = profile.displayName;
                     new_user.facebook = profile.id;


                new_user.save(function (err) {
                    if(err)
                    {
                        console.log(err);
                    }
                    return done(err, new_user)
                })
            }


        })
    }
));