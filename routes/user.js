const express = require("express")
const router = express.Router({mergeParams : true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");



// USER SIGNUP ROUTE

router.get("/signup" , (req , res) => {
    res.render("user/userSignUp.ejs")
});

router.post("/signup"  , wrapAsync(async(req , res) => {
    try{
        let {username , password , email} = req.body;
        let newUser = new User({email , username})
        let registerUser = await User.register(newUser , password);
        req.login(registerUser , (err) => {
            if(err) {
                return next(err)
            }
            req.flash("success" , "Welcome to Wanderlust");
            res.redirect("/listing")
        })
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup")
    }
}));

// USER LOGIN ROUTE

router.get("/login" , (req , res) => {
    res.render("user/userLogin.ejs")
})

router.post("/login", saveRedirectUrl ,passport.authenticate("local",{failureRedirect: "/login", failureFlash:true}) ,(req , res) => {
    req.flash("success" , "Welcome to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listing"
    res.redirect(redirectUrl);
})

router.get("/logout" , (req , res ) => {
    req.logout((err) => {
        if(err) {
            return next(err)
        }
        req.flash("success" , "Logged You Out")
        res.redirect("/listing");
    })
})

module.exports = router;