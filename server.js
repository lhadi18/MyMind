const express = require("express");
const path = require('path');
const session = require('express-session');
const User = require("./models/BBY_31_users");
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require('bcrypt');
const port = 8000;
const app = express();
app.set('view engine', 'text/html');

const uri = "mongodb+srv://DBUser:Admin123@cluster0.z9j9r.mongodb.net/BBY-31?retryWrites=true&w=majority";
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
function isLoggedIn(req, res, next) {
    if (req.session.isLoggedIn) {
        return next();
    }
    else {
        return res.redirect('/login');
    }
}

function isLoggedOut(req, res, next) {
    if (!req.session.isLoggedIn) {
        return next();
    }
    else {
        return res.redirect('/userprofile');
    }
}

function isAdmin(req, res, next) {
    if (req.session.user.userType == "admin") {
        return next();
    }
    else {
        return res.redirect('/userprofile');
    }
}

function setHeaders(req, res, next) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    return next();
}

//Routes
var profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})

var profileUpload = multer({ storage: profileStorage })

app.post('/uploadProfile', profileUpload.single('profileFile'), (req, res) => {
    if (req.file) {
        var fileName = req.file.filename;
        var id = req.session.user._id;
        User.updateOne(
            { "_id": id },
            {
                profileImg: "../uploads/" + fileName
            }
        ).then((obj) => {
            console.log('Updated - ' + obj);
        })
    } else {
        return;
    }
});

app.get('/getProfilePicture', (req, res) => {
    var id = req.session.user._id;
    User.findById({
        _id: id
    }, function (err, user) {
        if (user) {
            res.send(user)
        }
    })
})

app.get('/isLoggedIn', (req, res) => {
    res.send(req.session.user);
})

app.get('/', function (req, res) {
    res.sendFile(path.resolve('public/index.html'));
});

app.get('/therapists', function (req, res) {
    res.sendFile(path.resolve('public/therapists.html'));
});

app.get("/login", isLoggedOut, setHeaders, (req, res) => {
    res.sendFile(path.resolve('public/login.html'));
});

app.get('/admin-dashboard', isLoggedIn, isAdmin, setHeaders, (req, res) => {
    res.sendFile(path.resolve('public/admin-dashboard.html'))
});

app.get('/getUserInfo', isLoggedIn, setHeaders, (req, res) => {
    let userId = req.session.user._id;
    User.findById({
        _id: userId
    }, function (err, user) {
        if (err) console.log(err)
        if (user) {
            res.json(user);
        }
    })
})

app.get('/getTherapists', (req, res) => {
    User.find({
        userType: "therapist"
    }, function (err, user) {
        if (err) console.log(err)
        if (user) {
            res.json(user);
        }
    })
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
            res.json("NoEmailExist");
            console.log('No user with such email.');
        }
        else {
            return auth(req, res, user);
        }
    });
})

function auth(req, res, user) {
    bcrypt.compare(req.body.password, user.password, function (err, comp) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        }
        else if (comp === false) {
            console.log("Wrong password");
            res.json("wrongPassword");
        }
        else {
            req.session.user = user;
            req.session.isLoggedIn = true;
            res.json(user);
        }
    })
}

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.log('Error removing user session data. ', err);
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

app.post('/editProfile', isLoggedIn, isNotExisting, async (req, res) => {
    let hashedPassword;
    var pass = req.session.user.password;
    var newpass;
    if (req.body.password == "") {
        newpass = pass;
    } else {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
        newpass = hashedPassword;
    }

    User.updateOne(
        { "_id": req.session.user._id },
        {
            "firstName": req.body.firstname,
            "lastName": req.body.lastname,
            "username": req.body.username,
            "email": req.body.email,
            "phoneNum": req.body.phone,
            "password": newpass
        }
    )
        .then((obj) => {
            return res.json("updated");
        })
        .catch((err) => {
            console.log('Error: ' + err);
        })
})

async function isNotExisting(req, res, next) {
    var emailExists = await User.exists({
        email: req.body.email
    })
    var phoneExists = await User.exists({
        phoneNum: req.body.phone
    })
    var usernameExists = await User.exists({
        username: req.body.username
    })

    let userId = req.session.user._id;
    User.findById({
        _id: userId
    }, function (err, user) {
        if (err) console.log(err)
        if (user) {
            if (emailExists && req.body.email != user.email) {
                return res.json("existingEmail");
            } else if (phoneExists && req.body.phone != user.phoneNum) {
                return res.json("existingPhone")
            } else if (usernameExists && req.body.username != user.username) {
                return res.json("existingUsername")
            } else {
                return next();
            }
        } else {
            req.session.destroy();
            return res.json("logout");
        }
    })
}

app.post("/sign-up", isNotRegistered, async (req, res) => {
    if (req.body.userType == "therapist") {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const new_user = new User({
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                username: req.body.username,
                phoneNum: req.body.phone,
                userType: req.body.userType,
                yearsExperience: req.body.yearsExperience,
                sessionCost: req.body.sessionCost,
                email: req.body.email,
                password: hashedPassword
            });
            const existsAdmin = await User.exists({ isAdmin: true });
            if (!existsAdmin) { new_user.isAdmin = true }

            new_user.save()
                .then((result) => {
                    console.log(result);
                    res.json("login");
                });
        } catch (err) {
            console.log("Error while checking if user was already registered. ", err);
            res.redirect('/sign-up');
        }
    } else {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const new_user = new User({
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                username: req.body.username,
                phoneNum: req.body.phone,
                userType: req.body.userType,
                email: req.body.email,
                password: hashedPassword
            });
            const existsAdmin = await User.exists({ isAdmin: true });
            if (!existsAdmin) { new_user.isAdmin = true }

            new_user.save()
                .then((result) => {
                    console.log(result);
                    res.json("login");
                });
        } catch (err) {
            console.log("Error while checking if user was already registered. ", err);
            res.redirect('/sign-up');
        }
    }
})

async function isNotRegistered(req, res, next) {
    var emailExists = await User.exists({
        email: req.body.email
    })
    var phoneExists = await User.exists({
        phoneNum: req.body.phone
    })
    var usernameExists = await User.exists({
        username: req.body.username
    })
    if (emailExists) {
        return res.json("existingEmail");
    } else if (phoneExists) {
        return res.json("existingPhone")
    } else if (usernameExists) {
        return res.json("existingUsername")
    } else {
        return next();
    }
}

//Admin Dashboard
app.get('/getAllUsersData', isLoggedIn, isAdmin, setHeaders, (req, res) => {
    User.find({ }, function (err, user) {
        if (err) {
            console.log('Error searching user.', err); s
        }
        if (!user) {
            console.log('Database is empty.');
        }
        res.json(user);
    }); 
})

app.delete('/deleteUser', isLoggedIn, isAdmin, async (req, res) => {
    User.deleteOne({ _id: req.body.id })
    .then(function(){
        res.send();
    }).catch(function(error){
        console.log(error); // Failure
    });
})

async function isNotExistingAdmin(req, res, next) {
    var emailExists = await User.exists({
        email: req.body.email
    })
    var phoneExists = await User.exists({
        phoneNum: req.body.phone
    })
    var usernameExists = await User.exists({
        username: req.body.username
    })

    let userId = req.body.id;
    User.findById({
        _id: userId
    }, function (err, user) {
        if (err) console.log(err)
        if (user) {
            if (emailExists && req.body.email != user.email) {
                return res.send("existingEmail");
            } else if (phoneExists && req.body.phone != user.phoneNum) {
                return res.send("existingPhone")
            } else if (usernameExists && req.body.username != user.username) {
                return res.send("existingUsername")
            } else {
                return next();
            }
        } else {
            res.send("unexistingUser")
        }
    })
}

app.put('/editUser', isLoggedIn, isAdmin, isNotExistingAdmin, (req, res) => {
    if (req.body.password != ""){
        return updateUserWithPassword(req, res);
    }
    if (req.body.userType == "therapist") {
    User.updateOne(
        { "_id": req.body.id },
        { 
            "firstName": req.body.firstname,
            "lastName": req.body.lastname,
            "username": req.body.username,
            "email": req.body.email,
            "phoneNum": req.body.phone,
            "userType": req.body.userType,
            "yearsExperience": req.body.yearsExperience,
            "sessionCost": req.body.sessionCost
        }
    )
        .then((obj) => {
            return res.send("updatedWithoutPassword");
        })
        .catch((err) => {
            console.log('Error: ' + err);
        })
    } else {
        User.updateOne(
            { "_id": req.body.id },
            {
                $unset:  {"yearsExperience": "", "sessionCost": ""},
                "firstName": req.body.firstname,
                "lastName": req.body.lastname,
                "username": req.body.username,
                "email": req.body.email,
                "phoneNum": req.body.phone,
                "userType": req.body.userType
            }
        )
            .then((obj) => {
                return res.send("updatedWithoutPassword");
            })
            .catch((err) => {
                console.log('Error: ' + err);
            })
    }
})

async function updateUserWithPassword(req, res){
    var hashedPassword = await bcrypt.hash(req.body.password, 10);
    if (req.body.userType == "therapist") {
    User.updateOne(
        { "_id": req.body.id },
        {
            "firstName": req.body.firstname,
            "lastName": req.body.lastname,
            "username": req.body.username,
            "email": req.body.email,
            "phoneNum": req.body.phone,
            "userType": req.body.userType,
            "yearsExperience": req.body.yearsExperience,
            "sessionCost": req.body.sessionCost,
            "password": hashedPassword
        })
        .then((obj) => {
            return res.send("updatedWithPassword");
        })
        .catch((err) => {
            console.log('Error: ' + err);
        })
    } else {
        User.updateOne(
            { "_id": req.body.id },
            {
                $unset:  {"yearsExperience": "", "sessionCost": ""},
                "firstName": req.body.firstname,
                "lastName": req.body.lastname,
                "username": req.body.username,
                "email": req.body.email,
                "phoneNum": req.body.phone,
                "userType": req.body.userType,
                "password": hashedPassword
            })
            .then((obj) => {
                return res.send("updatedWithPassword");
            })
            .catch((err) => {
                console.log('Error: ' + err);
            })
    }
}

app.listen(port, () => {
    console.log(`Example app  listening on port ${port}`)
})
