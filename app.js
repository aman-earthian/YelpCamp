var express = require("express"),
    bodyParser = require("body-parser"),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    mongoose = require("mongoose"),
    methodOverride = require('method-override'),
    Campground = require('./models/campground'),
    Comment =  require('./models/comment'),
    User = require('./models/users'),
    seedDB = require('./seeds');
    flash = require('connect-flash');
var app = express();


//REQUIRING ROUTES    
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");



mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended : false}));
app.set("view engine" , "ejs");
app.use( express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());

app.get("/" , function(req , res){
    res.render("landing");
});

app.use(function(req , res , next){
    res.locals.currentUser = req.user;
    next();
});

// Campground.create(
//     {
//         name : "Salmon creek" , 
//         image : "https://images.unsplash.com/photo-1546890975-7596e98cdbf1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//         description: "This campground has huge granite hills  no water only granites"
//     } , function(err , campground){
//         if(err){
//             console.log(err);
//         } 
//     });




// =====================
// passport
// =====================
app.use(require('express-session')({
    secret: "It is a secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000 , '127.0.0.1' , function(){
    console.log("Server started");
});