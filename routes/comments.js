var express = require("express");
var router = express.Router({mergeParams: true}); //a new instance of express router and adding routes to this router - MERGES PARAMS FROM CAMPGROUNDS AND COMMENTS TOGETHER SO THAT INSIDE THE COMMENT ROUTES, WE'RE ABLE TO ACCESS THE :id WE DEFINED
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require('../middleware/index');


// ========================
// COMMENTS ROUTE
// ========================
router.get("/new" , middleware.isLoggedIn , function(req , res){
    
    Campground.findById(req.params.id , function(err , campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new" , {campground : campground});
        }
    });
});

router.post("/" , middleware.isLoggedIn , function(req , res){
    Campground.findById(req.params.id , function(err , campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.Comment , function(err , comment){
                if(err){
                    console.log(err);
                } else{
                    campground.comments.push(comment);
                    campground.save();

                    res.redirect('/campgrounds/'+campground._id);
                }
            });
        }
    }); 
});
//Edit Route
router.get("/:comments_id/edit", middleware.checkCommentOwnership , function(req,res){
    Comment.findById(req.params.comment_id , function(err , foundComment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            res.render("comments/edit" , {campground_id: req.params.id , comments: foundComment});
        } 
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership , function(req , res){
    Comment.findByIdAndUpdate(req.params.comment_id , req.body.comment , function(err  , updatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership , function(req , res){
    Comment.findByIdAndRemove(req.params.comment_id , function(err){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    })
});


module.exports = router;