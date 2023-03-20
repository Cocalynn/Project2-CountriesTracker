const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Country = require("../models/Country.model");

// Require necessary middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

// GET /visited
router.get("/visited", isLoggedIn, (req, res) => {
    User.findById(req.session.currentUser._id)
        .then((currentUser)=>{
            if (req.session.currentUser.role === "admin") {
                res.render("user/visited", { user: req.session.currentUser, layout:"layout/admin-layout" , currentUser: currentUser});
            } else if (req.session.currentUser.role === "user") {
                res.render("user/visited", { user: req.session.currentUser, layout:"layout/user-layout" , currentUser: currentUser});
            }
        })
        .catch((err)=>{
            console.log(err);
        })
});

// POST /visited
router.post("/visited/:journeyId/delete/:arrivalCountry", isLoggedIn, async (req, res) => {
    const { journeyId, arrivalCountry } = req.params;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.session.currentUser._id },
            { $pull: { visitedCountries: {_id: journeyId} } },
            { new: true}
        )

        await Country.findOneAndUpdate(
            { name: arrivalCountry },
            { $inc: { visitedTimes: -1 } },
            { new: true}
        )
        if (!updatedUser) {
            return res.status(404).send();
        }
      
        res.redirect("/visited");

    } catch(err) {
        res.status(500).send(err);
    }
})

// GET /wishlist
router.get("/wishlist", isLoggedIn, (req, res) => {
    if (req.session.currentUser.role === "admin") {
        res.render("user/wishlist", { user: req.session.currentUser, layout:"layout/admin-layout" });
    } else if (req.session.currentUser.role === "user") {
        res.render("user/wishlist", { user: req.session.currentUser, layout:"layout/user-layout" });
    }
});

// POST /wishlist
/* 
    ...
*/

// GET /statistics/visited
router.get("/statistics/visited", isLoggedIn, isAdmin, (req, res) => {
    res.render("admin/statistics-visited", { user: req.session.currentUser, layout:"layout/admin-layout" });
});

// GET /statistics/wishlist
router.get("/statistics/wishlist", isLoggedIn, isAdmin, (req, res) => {
    res.render("admin/statistics-wishlist", { user: req.session.currentUser, layout:"layout/admin-layout" });
});



module.exports = router;