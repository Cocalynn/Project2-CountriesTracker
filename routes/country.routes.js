const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

// GET /visited
router.get("/visited", isLoggedIn, (req, res) => {
    if (req.session.currentUser.role === "admin") {
        res.render("user/visited", { user: req.session.currentUser, layout:"layout/admin-layout" });
    } else if (req.session.currentUser.role === "user") {
        res.render("user/visited", { user: req.session.currentUser, layout:"layout/user-layout" });
    }
});

// POST /visited
/* 
    ...
*/

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