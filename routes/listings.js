const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const {listingSchema, reviewSchema} = require("../schema");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner, validateListing} = require("../middleware");
const Review = require("../models/review");
const listingController = require("../controllers/listings");
const multer = require("multer");
const {storage} = require("../cloudConfig");
const upload = multer({storage});


router
 .route("/")
 .get(wrapAsync(listingController.index))
 .post(isLoggedIn,  upload.single("listing[image]"), validateListing,  wrapAsync(listingController.createListing));

 //new route
 router.get("/new", isLoggedIn, listingController.renderNewForm);

router
 .route("/:id")
 .get(wrapAsync(listingController.showlistings))
 .put( isLoggedIn, isOwner, upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
 .delete(isLoggedIn, wrapAsync(listingController.destroyListing));








//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditListingForm));    



module.exports = router;