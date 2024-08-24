const express = require("express")
const app = express();
const path = require("path")
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
 
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


// ROUTES

app.get("/" , (req , res) => {
    res.send("home route")
});

// Index Route

app.get("/listing" , async (req , res) => {
  let alllisting = await Listing.find() 
  res.render("./listing/index.ejs" , {alllisting})
});

//  NEW ROUTE

app.get("/listing/new" , (req , res) => {
    res.render("listing/new.ejs")
});


// Show Route

app.get("/listing/:id" , async (req , res) => {
    let {id} = req.params;
    let data = await Listing.findById(id);
    res.render("./listing/show.ejs" , {data})
 });

 // update route

app.post("/listing" , async (req , res) => {
    let {listing} = req.body
    let newListing = await new Listing(listing)
    newListing.save();
    res.redirect("listing")
});

app.get("/listing/:id/edit" , async (req, res) => {
    let {id} = req.params;
    let data = await Listing.findById(id);
    if(!id){
        throw new Error("Can't Edit this page . Wrong id")
    }
    res.render("listing/edit.ejs" , {data})
});

app.put("/listing/:id" , async (req , res) => {
    let {id} = req.params;
    let {listing} = req.body;
    let data = await Listing.findById(id);
    await Listing.findByIdAndUpdate(id , {...listing})
    res.redirect(`/listing/${id}`)
});

// DELETE ROUTE

app.delete("/listing/:id" , async (req , res) => {
    let {id} = req.params;
    let data = await Listing.findByIdAndDelete(id);
    res.redirect("/listing")
});

app.use((err , req , res, next) => {
    console.log(err.message)
    next(err);
});


// listening route

app.listen(3000 , () => {
    console.log(" listening on Port 3000....")
});