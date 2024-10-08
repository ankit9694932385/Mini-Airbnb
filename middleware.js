const Listing = require("./models/listing");
const Review = require("./models/review.js");

module.exports.isLoggedIn =  (req , res , next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "Please Logged in  First ")
        return res.redirect("/login")
    }
    next()
};

module.exports.saveRedirectUrl = (req , res , next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async(req , res , next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the Owner of this listing !");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req , res , next) => {
    let { id , reviewId } = req.params;
    let review  = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the Author of this Review !");
        return res.redirect(`/listing/${id}`);
    }

    next();
}


 

 

