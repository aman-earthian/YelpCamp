var Campground = require('../models/campground'),
    Comment = require('../models/comment');
var middlewareObject = {};

middlewareObject.checkOwner = function(req , res , next){

    // is user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.comment_id , function(err , foundComment){
            if(err){
                console.log(err);
                res.redirect("back");
            } else{
                //does user own campground
                if(foundComment.author.id.equals( req.user._id)){
                   next();
                } else{
                    res.redirect("back");
                }
            }  
        });
    } else{
        res.redirect("/login"); 
    }
}

middlewareObject.checkCommentOwnership = function(req , res , next){

    // is user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id , function(err , foundComment){
            if(err){
                console.log(err);
                res.redirect("back");
            } else{
                //does user own campground
                if(foundComment.author.id.equals( req.user._id)){
                   next();
                } else{
                    res.redirect("back");
                }
            }  
        });
    } else{
        res.redirect("/login"); 
    }
}

middlewareObject.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login first!")
    res.redirect("/login");
}

module.exports =  middlewareObject;