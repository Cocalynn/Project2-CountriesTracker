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

router.post("/countries/:countryName", async (req, res) => {
    const countryName = req.params
  try {
    const country = await Country.find({name:countryName});
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }
    const { action } = req.body;
    if (action === "visit") {
      country.visitedTimes++;
    } else if (action === "plan") {
      country.plannedTimes++;
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
    await country.save();
    res.status(200).json({ message: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
