const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

// make the array of nationalities array of objects instead of strings
const nationalitiesArr = [
  // countries in total: 192, needs to be consistent with the countries in the Country model and map.js library
  "Afghan",
  "Albanian",
  "Algerian",
  "American",
  "Andorran",
  "Angolan",
  "Antiguans",
  "Argentinean",
  "Armenian",
  "Australian",
  "Austrian",
  "Azerbaijani",
  "Bahamian",
  "Bahraini",
  "Bangladeshi",
  "Barbadian",
  "Barbudans",
  "Batswana",
  "Belarusian",
  "Belgian",
  "Belizean",
  "Beninese",
  "Bhutanese",
  "Bolivian",
  "Bosnian",
  "Brazilian",
  "British",
  "Bruneian",
  "Bulgarian",
  "Burkinabe",
  "Burmese",
  "Burundian",
  "Cambodian",
  "Cameroonian",
  "Canadian",
  "Cape Verdean",
  "Central African",
  "Chadian",
  "Chilean",
  "Chinese",
  "Colombian",
  "Comoran",
  "Congolese",
  "Costa Rican",
  "Croatian",
  "Cuban",
  "Cypriot",
  "Czech",
  "Danish",
  "Djibouti",
  "Dominican",
  "Dutch",
  "East Timorese",
  "Ecuadorean",
  "Egyptian",
  "Emirian",
  "Equatorial Guinean",
  "Eritrean",
  "Estonian",
  "Ethiopian",
  "Fijian",
  "Filipino",
  "Finnish",
  "French",
  "Gabonese",
  "Gambian",
  "Georgian",
  "German",
  "Ghanaian",
  "Greek",
  "Grenadian",
  "Guatemalan",
  "Guinea-Bissauan",
  "Guinean",
  "Guyanese",
  "Haitian",
  "Herzegovinian",
  "Honduran",
  "Hungarian",
  "Icelander",
  "Indian",
  "Indonesian",
  "Iranian",
  "Iraqi",
  "Irish",
  "Israeli",
  "Italian",
  "Ivorian",
  "Jamaican",
  "Japanese",
  "Jordanian",
  "Kazakhstani",
  "Kenyan",
  "Kittian and Nevisian",
  "Kuwaiti",
  "Kyrgyz",
  "Laotian",
  "Latvian",
  "Lebanese",
  "Liberian",
  "Libyan",
  "Liechtensteiner",
  "Lithuanian",
  "Luxembourger",
  "Macedonian",
  "Malagasy",
  "Malawian",
  "Malaysian",
  "Maldivan",
  "Malian",
  "Maltese",
  "Marshallese",
  "Mauritanian",
  "Mauritian",
  "Mexican",
  "Micronesian",
  "Moldovan",
  "Monacan",
  "Mongolian",
  "Moroccan",
  "Mosotho",
  "Motswana",
  "Mozambican",
  "Namibian",
  "Nauruan",
  "Nepalese",
  "New Zealander",
  "Ni-Vanuatu",
  "Nicaraguan",
  "Nigerian",
  "North Korean",
  "Northern Irish",
  "Norwegian",
  "Omani",
  "Pakistani",
  "Palauan",
  "Panamanian",
  "Papua New Guinean",
  "Paraguayan",
  "Peruvian",
  "Polish",
  "Portuguese",
  "Qatari",
  "Romanian",
  "Russian",
  "Rwandan",
  "Saint Lucian",
  "Salvadoran",
  "Samoan",
  "San Marinese",
  "Sao Tomean",
  "Saudi",
  "Scottish",
  "Senegalese",
  "Serbian",
  "Seychellois",
  "Sierra Leonean",
  "Singaporean",
  "Slovakian",
  "Slovenian",
  "Solomon Islander",
  "Somali",
  "South African",
  "South Korean",
  "Spanish",
  "Sri Lankan",
  "Sudanese",
  "Surinamer",
  "Swazi",
  "Swedish",
  "Swiss",
  "Syrian",
  "Taiwanese",
  "Tajik",
  "Tanzanian",
  "Thai",
  "Togolese",
  "Tongan",
  "Trinidadian or Tobagonian",
  "Tunisian",
  "Turkish",
  "Tuvaluan",
  "Ugandan",
  "Ukrainian",
  "Uruguayan",
  "Uzbekistani",
  "Venezuelan",
  "Vietnamese",
  "Welsh",
  "Yemenite",
  "Zambian",
  "Zimbabwean"
]
const nationalities = nationalitiesArr.map(x=>{return {name:x}})

// Home page 
router.get("/", (req, res) => {
  res.render("auth/signup", {nationalities: nationalities, layout: "layout/guest-layout"});
});


// GET /signup
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup", {nationalities: nationalities, layout: "layout/guest-layout"});
});

// POST /signup
router.post("/signup", isLoggedOut, (req, res) => {
  const { username, email, password, nationality } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "" || nationality === "") {
    res.status(400).render("auth/signup", {
      nationalities: nationalities,
      errorMessage:
        "All fields are mandatory. Please provide your username, nationality, email and password.",
    });

    return;
  }

  /*
  if (password.length < 6) {
    res.status(400).render("auth/signup", {
      nationalities: nationalities,
      errorMessage: "Your password needs to be at least 6 characters long.",
    });

    return;
  }
  */

  //   ! This regular expression checks password for special characters and minimum length
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(400)
      .render("auth/signup", {
        nationalities: nationalities,
        errorMessage: "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
        layout: "layout/guest-layout"
    });
    return;
  }
  
  // Create a new user - start by hashing the password
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      return User.create({ username, email, nationality, passwordHash: hashedPassword });
    })
    .then((user) => {
      res.redirect("/login");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message, layout: "layout/guest-layout" });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          nationalities: nationalities,
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
        next(error);
      }
    });
});

// GET /login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login", {layout: "layout/guest-layout"});
});

// POST /login
router.post("/login", isLoggedOut, (req, res, next) => {
  console.log("SESSION =====> ", req.session); // test
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username, email and password.",
    });

    return;
  }
  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." , layout: "layout/guest-layout"});
        return;
      }
      // If user is found based on the username, check if the in putted password matches the one saved in the database
      else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        // if the two passwords DON'T match, render the login form again
        // and send the error message to the user
        res.render("auth/login", {
          errorMessage: "Incorrect password.",
          layout: 'guest-layout.hbs'
        });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// GET /logout
// router.get("/logout", isLoggedIn, (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       res.status(500).render("auth/logout", { errorMessage: err.message });
//       return;
//     }
//     res.redirect("/");
//   });
// });

// POST /logout
router.post("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }
    res.redirect("/");
  });
});


router.get("/userProfile", isLoggedIn, (req, res) => {
  if (req.session.currentUser.role === "user") {
    res.render("user/user-profile", { userInSession: req.session.currentUser, layout: "layout/user-layout" });
  }
  else if (req.session.currentUser.role === "admin") {
  res.render("user/user-profile", { userInSession: req.session.currentUser, layout: "layout/admin-layout" });
  }
});

module.exports = router;
