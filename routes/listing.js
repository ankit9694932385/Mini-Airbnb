const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../Schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner } = require("../middleware.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});
 
const listingValidation =  (req,res,next)=>{
    console.log(req.body);
    let {error}=listingSchema.validate(req.body,{abortEarly:false});
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(", ");
        console.log(errMsg);
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}



// INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
    let alllisting = await Listing.find(); 
    res.render("./listing/index.ejs", { alllisting });
}));

// NEW ROUTE
router.get("/new", isLoggedIn , (req, res) => {
    res.render("listing/new.ejs");
});

// SHOW ROUTE
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id)
      .populate({
        path: "review",
        populate : {
            path: "author"
        }
      })
      .populate("owner");
    if(!data){
        req.flash("error" , "Listing not Exist")
        res.redirect("/listing")
    }
    res.render( "./listing/show.ejs", { data });
}));

// CREATE ROUTE 
router.post("/", isLoggedIn, upload.single('listing[image]') , wrapAsync(async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
         
    let url = req.file.path;
    let filename = req.file.filename;

    let { listing } = req.body;
    listing = { ...listing };

    if (req.file) {
        listing.image = req.file.path; 
    }

    let newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = { url , filename}
    newListing.geometry = response.body.features[0].geometry;
    let newSavedListing = await newListing.save();
    console.log(newSavedListing);
    req.flash("success", "New Listing created");
    res.redirect("/listing");
}));



// EDIT ROUTE
router.get("/:id/edit", isLoggedIn , isOwner , wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    if(!data){
        req.flash("error" , "Listing not Exist")
        res.redirect("/listing")
    }
    res.render("./listing/edit.ejs", { data });
}));

// UPDATE ROUTE
router.put("/:id", isLoggedIn , isOwner , upload.single('listing[image]'),  listingValidation  , wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate( id , {...req.body.listing} , {new : true})
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url , filename }
        await listing.save();
    }
    req.flash("success" , "Listing Updated");
    res.redirect(`/listing/${id}`);
}));

// DELETE ROUTE
router.delete("/:id", isLoggedIn , isOwner , wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("error" , "Listing Deleted");
    res.redirect("/listing");
}));

module.exports = router;
