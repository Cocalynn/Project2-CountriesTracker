const express = require("express");
const router = express.Router();
const Country = require("../models/Country.model");
const User = require("../models/User.model");

// Require necessary middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

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

//Post /wishlist
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

// Route to update the plannedTimes field
router.put("/countries/:countryId/plan", async (req, res) => {
  const { countryId } = req.params;
  console.log(req.params);
  const { plannedTimes } = req.body;
  const user = req.session.currentUser.username;
  console.log({ user: user });

  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: user },
      { $addToSet: { plannedCountries: countryId } },
      { new: true }
    );

    const updatedCountry = await Country.findOneAndUpdate(
      { cid: countryId },
      { $inc: { plannedTimes: plannedTimes } },
      { new: true }
    );

    if (!updatedCountry) {
      return res.status(404).send();
    }

    res.send(updatedCountry);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Delete country route
router.delete("/delete/:countryId", (req, res) => {});

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
