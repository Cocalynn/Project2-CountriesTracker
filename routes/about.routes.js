const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

// GET /aboutus
router.get("/aboutus", (req, res) => {
    let currentUser = req.session.currentUser || {}
    if (currentUser.role === "admin") {
    res.render("user/about-us", { layout:"layout/admin-layout" });
    } else if (currentUser.role === "user") {
    res.render("user/about-us", { layout:"layout/user-layout" });
    } else {
    res.render("user/about-us", { layout:"layout/guest-layout" });
    }
});





module.exports = router;