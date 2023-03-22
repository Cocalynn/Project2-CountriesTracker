const express = require("express");
const router = express.Router();
const Country = require("../models/Country.model");
const User = require("../models/User.model");

// Require necessary middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

// Get the countries saved by the user

router.get("/countries/saved", isLoggedIn, async (req, res) => {
  // Make sure a user is logged in
  if (!req.session.currentUser) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const username = req.session.currentUser.username;

  try {
    // Query the User model using the username and populate the plannedCountries field
    const user = await User.findOne({ username: username }).populate(
      "plannedCountries.country"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return an array of country codes
    const countryCodes = user.plannedCountries.map(
      (plannedCountry) => plannedCountry.country.cid
    );
    res.status(200).json(countryCodes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch saved countries" });
  }
});

// Get all the users data
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    const data = users.map((user) => {
      return {
        id: user._id.toString(),
        name: user.username,
        role: user.role,
        visitedCountries: user.visitedCountries,
        plannedCountries: user.plannedCountries,
      };
    });
    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//Post /wishlist TODO check this
router.post("/visited/delete/:planCountry", isLoggedIn, async (req, res) => {
  console.log(req.params);
  const { planCountry } = req.params;
  const user = req.session.currentUser.username;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { name: user },
      { $pull: { plannedCountry: { planCountry } } },
      { new: true }
    );

    await Country.findOneAndUpdate(
      { cid: planCountry },
      { $inc: { visitedTimes: -1 } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send();
    }

    res.redirect("/wishlist");
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get the current user
router.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Get all the countries data
router.get("/countries", async (req, res) => {
  try {
    const countries = await Country.find({});
    const data = countries.map((country) => {
      return {
        id: country._id.toString(),
        cid: country.cid,
        name: country.name,
        visitedTimes: country.visitedTimes,
        plannedTimes: country.plannedTimes,
      };
    });
    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// get the CID from the map and look for it on the db

router.get("/countries/cid/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const country = await Country.findOne({ cid: cid });
    if (!country) {
      return res.status(404).send();
    }
    res.send(country);
  } catch (error) {
    console.error("Error in GET route:", error);
    res.status(500).send({ error: error.message });
  }
});

// Route to update the plannedTimes field
router.put("/countries/:countryObjectId/plan", async (req, res) => {
  const { countryObjectId } = req.params;
  console.log(req.params);
  const { plannedTimes, country } = req.body; // Get the country object from the request body
  console.log(country);
  const user = req.session.currentUser.username;
  console.log({ user: user });

  try {
    // Update the user model with the entire country object
    const updatedUser = await User.findOneAndUpdate(
      { username: user },
      { $addToSet: { plannedCountries: { country: country } } }, // Store the entire country object
      { new: true }
    );

    const updatedCountry = await Country.findOneAndUpdate(
      { _id: countryObjectId },
      { $inc: { plannedTimes: plannedTimes } },
      { new: true }
    );

    if (!updatedCountry) {
      return res.status(404).send();
    }

    res.send(updatedCountry);
  } catch (error) {
    console.error("Error in PUT route:", error);
    res.status(500).send({ error: error.message });
  }
});

// Delete planned country route
router.post("/plan/delete/:countryObjectId", async (req, res) => {
  const { countryObjectId } = req.params;
  const user = req.session.currentUser.username;

  try {
    const currentUser = await User.findOne({ username: user });
    currentUser.plannedCountries = currentUser.plannedCountries.filter(
      (plannedCountry) => plannedCountry.country.toString() !== countryObjectId
    );
    await currentUser.save();

    await Country.findOneAndUpdate(
      { _id: countryObjectId },
      { $inc: { plannedTimes: -1 } },
      { new: true }
    );

    res.redirect("/wishlist");
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/visited/:userId", async (req, res) => {
  const userId = req.params.userId;
  const visitedCountries = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId }, // yes
      { $push: { visitedCountries: visitedCountries } },
      { new: true }
    );

    //update countries collection: visitedTimes +1
    await Country.findOneAndUpdate(
      { name: visitedCountries.to.country },
      { $inc: { visitedTimes: 1 } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send();
    }

    res.send(updatedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
