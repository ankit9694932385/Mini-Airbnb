const express = require("express")
const app = express();
const path = require("path")
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
 
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
    res.send("👩👩👩👩🏻👩🏻home route💂‍♀️💂‍♀️💂‍♀️💂‍♀️")
});

// Index Route

app.get("/listing" , async(req , res) => {
    let alllisting = await Listing.find(); 
    res.render("./listing/index.ejs" , {alllisting})
});

//  NEW ROUTE

app.get("/listing/new" , (req , res) => {
    res.render("listing/new.ejs")
});

// Show Route

app.get("/listing/:id" , wrapAsync(async (req , res) => {
    let {id} = req.params;
    let data = await Listing.findById(id);
    res.render("./listing/show.ejs" , {data})
 }));

// CREATE ROUTE


app.post("/listing", wrapAsync(async (req, res, next) => {
    // Check if the body exists and has the listing property
    if (!req.body || !req.body.listing) {
        throw new ExpressError(400, "Bad Request: Listing data is required");
    }

    let { listing } = req.body;

    // Create a new listing and save it to the database
    let newListing = new Listing(listing);
    await newListing.save();

    // Redirect to the listing page or send a success response
    res.redirect("/listing");
}));


// app.post("/listing" , wrapAsync(async (req , res , next) => {
//     let { listing } = req.body
//     if(!listing){
//         throw new ExpressError(400 , "Bad Request")
//     }
//     let newListing = await new Listing(listing)
//     newListing.save();
//     res.redirect("/listing")
// }));

// UPDATE ROUTE

app.get("/listing/:id/edit" , wrapAsync(async (req, res) => {
    let {id} = req.params;
    let data = await Listing.findById(id);
    res.render("./listing/edit.ejs" , {data})
}));

app.put("/listing/:id" , wrapAsync(async (req , res) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400 ,  "Bad Request , Send valid data")
    // }
    let {id} = req.params;
    let {listing} = req.body;
    let data = await Listing.findById(id);
    await Listing.findByIdAndUpdate(id , {...listing})
    res.redirect(`/listing/${id}`)
}));

// DELETE ROUTE

app.delete("/listing/:id" , wrapAsync(async (req , res) => {
    let {id} = req.params;
    let data = await Listing.findByIdAndDelete(id);
    res.redirect("/listing")
}));


// listening route

app.listen(3000 , () => {
    console.log(" listening on Port 3000....")
});

app.all("*" , (req , res , next) => {
    throw new ExpressError(404 ,  "Page not found")
});


app.use((err , req , res , next) => {
    let {statusCode= 500 , message="SOMTHING WRONG"} = err;
    res.render("error.ejs" ,{err} )
    next(err);
});