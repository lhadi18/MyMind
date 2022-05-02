const express = require("express");
const path = require('path');
const session = require('express-session');
const User = require("./models/user");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
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

app.get('/', function(req, res) {
    res.sendFile(path.resolve('views/index.html'));
  });

app.get("/login", (req, res) => {
    if (req.session.isLoggedIn) {
         return res.sendFile(path.resolve('views/userprofile.html')); 
    }
    res.sendFile(path.resolve('views/login/index.html'));
})

app.post('/login', async (req, res) => {
    User.findOne({
        email: req.body.email, 
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            console.log('No user with such email.')
            res.sendFile(path.resolve('views/login/index.html'))
        } 
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
            res.sendFile(path.resolve('views/login/index.html'))
        }
        else if (comp === false){
            console.log('Incorrect password.')
            res.sendFile(path.resolve('views/login/index.html'))
        }
        else{
            req.session.user = user;
            req.session.isLoggedIn = true;
            res.sendFile(path.resolve('views/sign-up/index.html'))
        }
    })
}

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) console.log('Error removing user session data. ', err);
    });
    res.sendFile(path.resolve('views/login/index.html'))
})

app.get('/userprofile', (req, res) => {
    if (req.session.isLoggedIn)
        res.sendFile(path.resolve('views/login/index.html'))
    else
        res.sendFile(path.resolve('views/login/index.html'))
})

app.get("/sign-up", (req, res) => {
    if (req.session.isLoggedIn) {
        res.sendFile(path.resolve('views/login/index.html'))
    };
    res.sendFile(path.resolve('views/sign-up/index.html'))
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
        if (!existsAdmin) { new_user.isAdmin = true}

        new_user.save()
            .then((result) => {
                console.log(result);
            });

            res.sendFile(path.resolve('views/login/index.html'))
    } catch (err) {
        console.log("Error while checking if user was already registered. ", err);
        res.sendFile(path.resolve('views/sign-up/index.html'))
    }
})

function isNotRegistered(req, res, next){
    User.findOne({
        email: req.body.email, 
    }, function (err, user) {
        if (err) {
            console.log(err);
            return res.sendFile(path.resolve('views/sign-up/index.html'))
        }
        if (user) {
            console.log(`User with email '${user.email}' already exists`)
            return res.sendFile(path.resolve('views/sign-up/index.html'))
        }
        return next();
    })
}

app.listen(port, () => {
    console.log(`Example app  listening on port ${port}`)
})