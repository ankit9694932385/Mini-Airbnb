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
    res.render("./listing/show.ejs", { data });
}));

// CREATE ROUTE  =   ("image  upload.single= from where we want to extract data ,  file name")
  router.post("/", isLoggedIn, upload.single('listing[image]') , wrapAsync(async (req, res) => {
      let { listing } = req.body;
      console.log(listing);
      let newListing = new Listing(listing);
      newListing.owner = req.user._id;
      await newListing.save();
      req.flash("success" , "New Listing created");
      res.redirect("/listing");
 }))



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
router.put("/:id", isLoggedIn , isOwner , listingValidation, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate( id , {...req.body.listing} , {new : true})
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
