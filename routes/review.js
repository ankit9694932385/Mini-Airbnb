const express = require("express")
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("../Schema.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


const reviewValidation = (req , res , next) => {
    let { error } = reviewSchema.validate(req.body)
    if(error){
        throw new ExpressError(400 , error )
    }else {
        next();
    }
}


// REVIEWS 
// REVIEW POST ROUTE

router.post("/" , reviewValidation , wrapAsync(async (req , res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);

    listing.review.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success" , "Review Added!");

    res.redirect(`/listing/${listing.id}`)
 }));

//  REVIEW DELETE ROUTE

router.delete("/:reviewId" , wrapAsync(async(req , res) => {
    let { id , reviewId } = req.params;

    await Listing.findByIdAndUpdate(id , {$pull : {review : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted!");

    res.redirect(`/listing/${id}`)
}));


module.exports = router;