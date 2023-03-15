const express = require("express");
const router = express.Router();
const Country = require("../models/Country.model");
const User = require("../models/User.model");

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

// Get all the countries data

router.get("/countries", async (req, res) => {
  try {
    const countries = await Country.find({});
    const data = countries.map((country) => {
      return {
        id: country._id.toString(),
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

// Route to update the visitedTimes field

router.put("/countries/:countryName/visited", async (req, res) => {
  const { countryName } = req.params;
  const { visitedTimes } = req.body;
  const user = req.session.currentUser.username;
  console.log({ user: user });

  try {
    const country = await Country.findOneAndUpdate(
      { name: countryName },
      { $inc: { visitedTimes: visitedTimes } },
      { new: true }
    );

    if (!country) {
      return res.status(404).send();
    }

    res.send(country);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
