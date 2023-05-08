if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const usersRoutes = require('./routes/users');
const { initialize, checkAuthenticated } = require('./passport-config');
const models = require('./models/users');
const parseurl = require('parseurl');
// const methodOverride = require('method-override');


const PORT = process.env.PORT || 500

const app = express();
app.set('view-engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(session({
     secret: process.env.SESSION_SECRET,
     resave: false,
     saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(methodOverride('_method'));
app.use((req, res, next) => {
    if (!req.session.views) req.session.views = {};
    // Get the url pathname
    const pathname = parseurl(req).pathname;
    // Count the views
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
    next();
});

initialize(passport, email => models.data.find(user => user.email === email), id => models.data.find(user => user.id === id)) ;


app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { req: req, path: '/', name: req.user.name, user: req.user });
});

app.use('/users', usersRoutes);

app.listen(PORT, (err) => {
    if (err) console.log(`Some Error occured while listening on ${PORT}!`);
});