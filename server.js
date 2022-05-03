const express = require("express");
const path = require('path');
const session = require('express-session');
const User = require("./models/user");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { isatty } = require("tty");
const port = 8000;
const app = express();
app.set('view engine', 'text/html');

const uri = "mongodb+srv://DBUser:Admin123@cluster0.z9j9r.mongodb.net/MyMindDatabase?retryWrites=true&w=majority";
mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("connected to db"))
    .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: "password",
    resave: false,
    saveUninitialized: true
}));

//Custom middleware functions
function isLoggedIn(req, res, next){
    if (req.session.isLoggedIn) {
        return next(); 
   } 
   else {
        return res.redirect('/login');
   }
}

function isLoggedOut(req, res, next){
    if (!req.session.isLoggedIn) {
        return next(); 
   } 
   else {
        return res.redirect('/userprofile');
   }
}

function isAdmin(req, res, next){
    if (req.session.user.isAdmin) {
        return next(); 
   } 
   else {
        return res.redirect('/userprofile');
   }
}

function setHeaders(req, res, next){
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    return next();
}

//Routes

app.get('/isLoggedIn', (req, res) => {
    res.send(req.session.isLoggedIn);
})

app.get('/', function(req, res) {
    res.sendFile(path.resolve('public/index.html'));
  });

app.get("/login", isLoggedOut, setHeaders, (req, res) => {
    res.sendFile(path.resolve('public/login.html'));
});

app.get('/admin-dashboard', isLoggedIn, isAdmin, setHeaders, (req, res) => {
    res.sendFile(path.resolve('public/admin-dashboard.html'))
});

app.get('/getAllUsersData', isLoggedIn, isAdmin, setHeaders, (req, res) => {
    User.find({}, function(err, user) {
        res.json(user);
    });
});

app.get('/getUserInfo', isLoggedIn, setHeaders, (req, res) => {
    let user = req.session.user;
    res.json(user);
})

app.post('/login', async (req, res) => {
    User.findOne({
        email: req.body.email, 
    }, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        }
        if (!user) {
            console.log('No user with such email.');
            res.redirect('/login');        } 
        else {
            return auth(req, res, user);
        }
    }); 
})

function auth(req, res, user){
    console.log(user);
    bcrypt.compare(req.body.password, user.password, function(err, comp) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        }
        else if (comp === false){
            console.log('Incorrect password.')
            res.redirect('/login');
        }
        else{
            req.session.user = user;
            req.session.isLoggedIn = true;
            if(user.isAdmin == true) {
                res.redirect('/admin-dashboard')
            } else {
                res.redirect('/userprofile')
            }
        }
    })
}

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) console.log('Error removing user session data. ', err);
    });
    res.redirect('/login')
})

app.get('/userprofile', isLoggedIn, setHeaders, (req, res) => {
    res.sendFile(path.resolve('public/userprofile.html'))
})

app.get('/edit-account', isLoggedIn, setHeaders, (req, res) => {
    res.sendFile(path.resolve('public/edit-account.html'))
})

app.get("/sign-up", isLoggedOut, setHeaders, (req, res) => {
    res.sendFile(path.resolve('public/sign-up.html'))
})

app.post("/sign-up", isNotRegistered, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const new_user = new User({
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            username: req.body.username,
            userType: req.body.userType,
            email: req.body.email,
            password: hashedPassword
        });
        const existsAdmin = await User.exists({ isAdmin: true });
        if (!existsAdmin) { new_user.isAdmin = true }

        new_user.save()
            .then((result) => {
                console.log(result);
            });

        res.redirect('/login')
    } catch (err) {
        console.log("Error while checking if user was already registered. ", err);
        res.redirect('/sign-up');
    }
})

function isNotRegistered(req, res, next){
    User.findOne({
        email: req.body.email, 
    }, function (err, user) {
        if (err) {
            console.log(err);
            return res.redirect('/sign-up');
        }
        if (user) {
            console.log(`User with email '${user.email}' already exists`)
            return res.redirect('/sign-up');
        }
        return next();
    })
}

app.listen(port, () => {
    console.log(`Example app  listening on port ${port}`)
})