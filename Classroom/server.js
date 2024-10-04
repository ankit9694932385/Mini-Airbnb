const express = require("express");
const app = express();
const session = require("express-session");
const flash = require('connect-flash');
const path = require("path");


app.set("view engine" , "ejs")
app.set("views" ,  path.join(__dirname , "views"));

app.use(flash());



app.use(session({
    secret : "ilovemyself",
    resave : false,
    saveUninitialized : true
}));

app.use((req , res , next) => {
    req.flash("akki" , "ilovehennakuamwat")
    res.locals.akki = req.flash("akki")
    next();
})

app.get("/test" , (req , res) => {
    res.redirect("/love")
});

app.get("/love" , (req , res) => {
    res.render("page.ejs")
})

app.listen( 3000 , () => {
    console.log("App is listening on port 3000");
});
