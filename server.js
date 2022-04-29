const { db } = require('./models/user');

const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      passport              =  require("passport"),
      bodyParser            =  require("body-parser"),
      LocalStrategy         =  require("passport-local"),
      passportLocalMongoose =  require("passport-local-mongoose"),
      User                  =  require("./models/user");
const existingUser = require('./models/user')

mongoose.connect("mongodb+srv://DBUser:Admin123@cluster0.z9j9r.mongodb.net/MyMindDatabase?retryWrites=true&w=majority");
app.use(require("express-session")({
    secret:"Any normal Word",
    resave: false,          
    saveUninitialized:false    
}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded(
      { extended:true }
))
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req,res) =>{
    res.render("home");
})
app.get("/userprofile",isLoggedIn ,(req,res) =>{
    res.render("userprofile");
})
app.get("/login",(req,res)=>{
    res.render("login");
});
app.post("/login",passport.authenticate("local",{
    successRedirect:"/userprofile",
    failureRedirect:"/login"
}),function (req, res){
});
app.get("/register",(req,res)=>{
    res.render("register");
});
app.post("/register",(req,res)=>{
    const existing = existingUser.find({})
    
    User.register(new User({firstName: req.body.firstname, lastName: req.body.lastname, username: req.body.username,email:req.body.email, isAdministrator:req.body.isadmin}),req.body.password,function(err,user){
        if(existing == req.body.username) {
            res.render("register")
            console.log("User already exists.")
        } else {
        if(err){
            console.log(err);
            res.render("register");
        }
    }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/login");
    })    
    })
})
app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(process.env.PORT ||8000,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log("Server Started At Port 8000");
    }
      
});