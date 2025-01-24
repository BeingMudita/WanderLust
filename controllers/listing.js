const { response } = require("express");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
}

module.exports.newRoute = (req, res)=>{  
    res.render("listings/new.ejs")
};

module.exports.CreateNewListingRoute = async (req, res, next) => {
    let Response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      }).send();
    try {
        let url = req.file.path;
        let filename = req.file.filename;
        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename }; 
        newListing.geometry = Response.body.features[0].geometry
        await newListing.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    } catch (err) {
        next(err); 
    }
};


module.exports.showRoute = async(req,res)=>{
    let {id}= req.params;
    const listing =  await Listing.findById(id).populate({path :"reviews", populate:{ path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested does not exist.");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing, mapToken: process.env.MAP_TOKEN });
}

module.exports.editRoute = async(req,res)=>{
    let {id}= req.params;
    const listing =  await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested does not exist.");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    let newImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", {listing , newImageUrl});
}

module.exports.updateRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }
        const updatedData = { ...req.body.listing };
        if (req.file) {
            const { path: url, filename } = req.file;
            updatedData.image = { url, filename };
        }
        await Listing.findByIdAndUpdate(id, updatedData);

        req.flash("success", "Listing Updated");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/listings");
    }
};


module.exports.deleteRoute = async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect(`/listings`);
}
