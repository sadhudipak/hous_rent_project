const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn ,isOwner , valideateListing}=require("../middleware.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })

const listingController=require("../controllers/listings.js");


router.route("/")
.get(wrapAsync(listingController.index))//Index Route
.post(isLoggedIn,
    upload.single('listing[image]'),
    valideateListing, 
    wrapAsync(listingController.createListing)//Create Route
);

//New Route
router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);

router.route("/:id")
.get(wrapAsync(listingController.showListing))//Show Route
.put(isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    valideateListing, 
    wrapAsync(listingController.updateListing)//Update Route
)
.delete(isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)//DELET Route
);



//Edit route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.renderEditForm)
);


module.exports = router;