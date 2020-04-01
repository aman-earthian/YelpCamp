var express = require("express");
var router = express.Router(); //a new instance of express router and adding routes to this router. 
var Campground = require("../models/campground");
var middleware = require('../middleware/index');
router.get("/",middleware.isLoggedIn , function(req , res){
    // {name : "Salmon creek" , image : "https://images.unsplash.com/photo-1546890975-7596e98cdbf1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    // {name : "Granite Hills" , image : "https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    // {name : "Mt. Goat" , image : "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"}
    Campground.find({} , function(err , campgrounds){
        if(err){
            console.log(err);
        } else{
         res.render("campgrounds/index" , {campgrounds : campgrounds});  
        }
    });    
});



router.get("/new" ,middleware.isLoggedIn , function(req , res){
    res.render("campgrounds/new");
});

router.post("/" , isLoggedIn , function(req , res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name : name , image : image , description : description};

    Campground.create(newCampground , function(err , newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
});

router.get("/:id" , function(req , res){

    Campground.findById(req.params.id , function(err , foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show" , {campground : foundCampground});
        }
    });
});

//===================
//Edit
//===================
router.get("/:id/edit", middleware.checkOwner,function(req,res){
 
        Campground.findById(req.params.id , function(err , foundCampground){
            if(err){
                console.log(err);
                res.redirect("/campgrounds");
            } else{
                res.render("campgrounds/edit" , {campground : foundCampground});
            }  
        });
});

router.put("/:id", middleware.checkOwner , function(req,res){

    Campground.findByIdAndUpdate(req.params.id , req.body.campground , function(err , updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//===========
//Destroy
//===========
router.delete("/:id" , middleware.checkOwner, function(req , res){
    Campground.findByIdAndRemove(req.params.id , function(err){
        if(err){
            console.log(err);
        } 
        res.redirect("/campgrounds");
    });
});

module.exports = router;