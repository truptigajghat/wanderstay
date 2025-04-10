const Listing = require("../models/listing");


// INDEX - Show all listings
module.exports.index = async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listing/index", {allListing});
};


// NEW - Show form to create a new listing
module.exports.renderNewForm = (req, res) => {
    res.render("listing/new");
};


// SHOW - Show details of one listing
module.exports.showlistings = async (req,res, next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate: {path: "author"},}).populate("owner");
    if (!listing) {
        req.flash("error", "no listing found");  
        return res.redirect("/listings");
    }
    
    res.render("listing/show", {listing});
 };


 // CREATE - Create a new listing
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename};
    await newlisting.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");

};


// EDIT - Show edit form
module.exports.renderEditListingForm = async(req, res) => {
    let {id} = req.params;
    
   const listing = await Listing.findById(id);
   if (!listing) {
     req.flash("error", "Listing doesnt found");
     return  res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
   res.render("listing/edit", {listing, originalImageUrl});
};

// UPDATE - Update listing
module.exports.updateListing =  async (req, res, next) => {

    let {id} = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, { runValidators: true, new: true });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);

};

// DELETE - Delete listing
module.exports.destroyListing =  async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
};