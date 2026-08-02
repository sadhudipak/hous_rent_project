const Listing=require("../models/listing");
const { geocoding, config } = require("@maptiler/client");
config.apiKey = process.env.MAPTILER_API_KEY;
const mapToken=process.env.MAPTILER_API_KEY
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing= async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    
    if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing,mapKey:process.env.MAPTILER_API_KEY});
};

module.exports.createListing=async(req,res,next)=>{
    
    const result = await geocoding.forward(
        req.body.listing.location,
        {
            limit: 1
        }
    );

    const newListing = new Listing(req.body.listing);
    // Save coordinates from MapTiler
    newListing.geometry = result.features[0].geometry;

    if (req.file) {
        newListing.image = {
            url: req.file.path, 
            filename: req.file.filename
        };
    }

    newListing.owner = req.user._id;

    await newListing.save();

    req.flash("success", "New Listing Created!");

    res.redirect(`/listings/${newListing._id}`);
};

module.exports.renderEditForm=async(req, res, next)=>{
    
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing });
};


module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing}, { new: true });
    
    if(typeof req.file !== "undefined"){

        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("success","listing Updated!");
    return res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted !");
    res.redirect("/listings");
};