const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner, validateListing}= require("../middleware");
const listingController = require("../controllers/listing");
const multer = require("multer");
const {storage} = require("../cloudConfig");
const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.CreateNewListingRoute)
);

//Create New Listing Route
router.get("/new", isLoggedIn, listingController.newRoute);

router.route("/:id")
.get( wrapAsync(listingController.showRoute))
.put( isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateRoute))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteRoute));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editRoute));

module.exports = router;