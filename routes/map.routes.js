const express = require("express");
const router = express.Router();
const Country = require("../models/Country.model");

router.get("/countries", async (req, res) => {
  try {
    const countries = await Country.find({});
    const data = countries.map((country) => {
      return {
        id: country._id.toString(),
        name: country.name,
        value: country.visitedTimes,
      };
    });
    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to update the visitedTimes field

router.put("/countries/:countryName", async (req, res) => {
  const { countryName } = req.params;
  const { visitedTimes } = req.body;

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
