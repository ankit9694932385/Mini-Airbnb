const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

 
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");


main()
  .then(res => {
     console.log("connection sucessfull");
  })
  .catch(err => {
     console.log(err);
  })

async function main() {
    await  mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}

app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.set("view engine" , "ejs")
app.set("views" ,  path.join(__dirname , "views"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname , "public")));
app.use(express.urlencoded({extended : true}));

sessionOptions = {
    secret : "ilovemyself",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( (req , res , next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
}) 

app.use("/listing" , listingRoutes);
app.use("/listing/:id/reviews" , reviewRoutes);
app.use("/" , userRoutes);


app.listen(3000 , () => {
    console.log(" listening on Port 3000....")
});

// ROUTES
app.get("/" , (req , res) => {
    res.send("👩👩👩👩🏻👩🏻home route💂‍♀️💂‍♀️💂‍♀️💂‍♀️");
});

app.all( "*" , (req , res , next) => {
    next(new ExpressError(404 , "Page Not Found"));
});

app.use((err , req , res , next) => {
    let {statusCode= 500 , message="SOMTHING WRONG"} = err;
    res.status(statusCode).render("error.ejs" ,{err} );
    next(err);
});