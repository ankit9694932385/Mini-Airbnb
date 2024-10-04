const express = require("express")
const router = express.Router({mergeParams : true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");



// USER SIGNUP ROUTE

router.get("/signup" , (req , res) => {
    res.render("user/userSignUp.ejs")
});

router.post("/signup"  , wrapAsync(async(req , res) => {
    try{
        let {username , password , email} = req.body;
        let newUser = new User({email , username})
        let registerUser = await User.register(newUser , password);
        req.flash("success" , "Welcome to Wanderlust");
        res.redirect("/listing")
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup")
    }
}));

// USER LOGIN ROUTE

router.get("/login" , (req , res) => {
    res.render("user/userLogin.ejs")
})

router.post("/login" ,passport.authenticate("local",{failureRedirect: "/login", failureFlash:true}) ,(req , res) => {
    res.flash("success" , "Welcome to Wanderlust");
    res.redirect("/listing");
})

module.exports = router;