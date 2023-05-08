const express = require('express');
const bcrypt = require('bcrypt');
const models = require('../models/users');
const passport = require('passport');
const checkNotAuthenticated = require('../passport-config').checkNotAuthenticated;


const router = express.Router();

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs', {req: req, path: '/users/register'});
});

router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const id = Date.now().toString();
        const name = req.body.name;
        const email = req.body.email;
        const password = hashedPassword;
        const newUser = new models.User(id, name, email, password);
        models.data.push(newUser);
        console.log(newUser);
        res.redirect('/users/login');
    } catch {
        res.redirect('users/register');
    }
});

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs', {req: req, path: '/users/login'});
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true 
}));

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/users/login');
    });
});

module.exports = router;