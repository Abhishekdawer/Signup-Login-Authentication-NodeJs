const express = require('express');
const routes = express.Router();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const bcrypt = require('bcryptjs');
const user = require('./models/usermodel.js');

routes.use(bodyparser.urlencoded({ extended:true}));

mongoose.connect('mongodb://localhost:27017/userDB',{
    useNewUrlParser:true, useUnifiedTopology:true,
})
.then(()=>{console.log('Database Connected!');});


routes.get('/',(req,res)=>{
    res.render('index');
});

routes.post('/register',(req,res)=>{
    var { email, username, password, confirmpassword } = req.body;
    var err;
    if (!email || !username || !password || !confirmpassword) {
        err = "Please Fill All The Fields...";
        res.render('index', { 'err': err });
    }
    if (password != confirmpassword) {
        err = "Passwords Don't Match";
        res.render('index', { 'err': err, 'email': email, 'username': username });
    }
    if (typeof err == 'undefined') {
        user.findOne({ email: email }, function (err, data) {
            if (err) throw err;
            if (data) {
                console.log("User Exists");
                err = "User Already Exists With This Email...";
                res.render('index', { 'err': err, 'email': email, 'username': username });
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        password = hash;
                        user({
                            email,
                            username,
                            password,
                        }).save((err, data) => {
                            if (err) throw err;
                            res.redirect('/login');
                        });
                    });
                });
            }
        });
    }

});

routes.get('/login',(req,res)=>{
 res.render('login');
});
module.exports = routes;