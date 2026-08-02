const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {valideateReview, isLoggedIn ,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews");

//Post review Route
router.post("/",isLoggedIn, valideateReview,wrapAsync(reviewController.createReview));

// Delete review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.distroyReview)) 

module.exports=router;