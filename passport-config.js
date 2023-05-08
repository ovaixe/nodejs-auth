const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');


function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async  (email, password, done) => {
        const user = getUserByEmail(email);
        if (user == null) {
            return done(null, false, { message: 'No user with that email exist!' });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Passord is incorrect!' });
            }
        } catch (e) {
            return done(e)
        }
    };
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => done(null, getUserById(id)));
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    }
    next();
}

module.exports = {initialize, checkAuthenticated, checkNotAuthenticated};