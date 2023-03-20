const Country = require("../models/Country.model");
const User = require("../models/User.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
require("dotenv").config();

const countries = 
    [
        // countries in total: 193, should be consistent with the enum in User.model.js and map.js library
        { cid: "AF", name: "Afghanistan", visitedTimes: 0, plannedTimes: 0 },
        { cid: "AL", name: "Albania", visitedTimes: 0, plannedTimes: 0 },
        { cid: "DZ", name: "Algeria", visitedTimes: 0, plannedTimes: 0 },
        { cid: "AD", name: "Andorra", visitedTimes: 0, plannedTimes: 0 },
        { cid: "AO", name: "Angola", visitedTimes: 0, plannedTimes: 0 },
        { cid: "AG", name: "Antigua and Barbuda", visitedTimes: 0, plannedTimes: 0 },
        { cid: "AR", name: "Argentina", visitedTimes: 0, plannedTimes: 0 },
        { cid: "AM", name: "Armenia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "AU", name: "Australia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "AT", name: "Austria", visitedTimes: 0, plannedTimes: 0 },
        { cid: "AZ", name: "Azerbaijan", visitedTimes: 0, plannedTimes: 0 },
        { cid: "BS", name: "Bahamas", visitedTimes: 0, plannedTimes: 0 },
        { cid: "BH", name: "Bahrain", visitedTimes: 0, plannedTimes: 0 },
        { cid: "BD", name: "Bangladesh", visitedTimes: 0, plannedTimes: 0 },
        { cid: "BB", name: "Barbados", visitedTimes: 0, plannedTimes: 0 },
        { cid: "BY", name: "Belarus", visitedTimes: 0, plannedTimes: 0 },
        { cid: "BE", name: "Belgium", visitedTimes: 0, plannedTimes: 0 },
        { cid: "BZ", name: "Belize", visitedTimes: 0, plannedTimes: 0 },
        { cid: "BJ", name: "Benin", visitedTimes: 0, plannedTimes: 0 },
        { cid: "BT", name: "Bhutan", visitedTimes: 0, plannedTimes: 0 },
        { cid: "BO", name: "Bolivia", visitedTimes: 0, plannedTimes: 0 },
        {
          cid: "BA",
          name: "Bosnia and Herzegovina",
          visitedTimes: 0,
          plannedTimes: 0,
        },
        { cid: "BW", name: "Botswana", visitedTimes: 0, plannedTimes: 0 },
        { cid: "BR", name: "Brazil", visitedTimes: 0, plannedTimes: 0 },
        { cid: "BN", name: "Brunei", visitedTimes: 0, plannedTimes: 0 },
        { cid: "BG", name: "Bulgaria", visitedTimes: 0, plannedTimes: 0 },
        { cid: "BF", name: "Burkina Faso", visitedTimes: 0, plannedTimes: 0 },
        { cid: "BI", name: "Burundi", visitedTimes: 0, plannedTimes: 0 },
        { cid: "KH", name: "Cambodia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "CM", name: "Cameroon", visitedTimes: 0, plannedTimes: 0 },
        { cid: "CA", name: "Canada", visitedTimes: 0, plannedTimes: 0 },
        { cid: "CV", name: "Cape Verde", visitedTimes: 0, plannedTimes: 0 },
        {
          cid: "CF",
          name: "Central African Republic",
          visitedTimes: 0,
          plannedTimes: 0,
        },
        { cid: "TD", name: "Chad", visitedTimes: 0, plannedTimes: 0 },
        { cid: "CL", name: "Chile", visitedTimes: 0, plannedTimes: 0 },
        { cid: "CN", name: "China", visitedTimes: 0, plannedTimes: 0 },
        { cid: "CO", name: "Colombia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "KM", name: "Comoros", visitedTimes: 0, plannedTimes: 0 },
        { cid: "CG", name: "Congo (Brazzaville)", visitedTimes: 0, plannedTimes: 0 },
        { cid: "CD", name: "Congo", visitedTimes: 0, plannedTimes: 0 },
        { cid: "CR", name: "Costa Rica", visitedTimes: 0, plannedTimes: 0 },
        { cid: "CI", name: "Cote d'Ivoire", visitedTimes: 0, plannedTimes: 0 },
        { cid: "HR", name: "Croatia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "CU", name: "Cuba", visitedTimes: 0, plannedTimes: 0 },
        { cid: "CY", name: "Cyprus", visitedTimes: 0, plannedTimes: 0 },
        { cid: "CZ", name: "Czech Republic", visitedTimes: 0, plannedTimes: 0 },
        { cid: "DK", name: "Denmark", visitedTimes: 0, plannedTimes: 0 },
        { cid: "DJ", name: "Djibouti", visitedTimes: 0, plannedTimes: 0 },
        { cid: "DM", name: "Dominica", visitedTimes: 0, plannedTimes: 0 },
        { cid: "DO", name: "Dominican Republic", visitedTimes: 0, plannedTimes: 0 },
        {
          cid: "TL",
          name: "East Timor (Timor Timur)",
          visitedTimes: 0,
          plannedTimes: 0,
        },
        { cid: "EC", name: "Ecuador", visitedTimes: 0, plannedTimes: 0 },
        { cid: "EG", name: "Egypt", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SV", name: "El Salvador", visitedTimes: 0, plannedTimes: 0 },
        { cid: "GQ", name: "Equatorial Guinea", visitedTimes: 0, plannedTimes: 0 },
        { cid: "ER", name: "Eritrea", visitedTimes: 0, plannedTimes: 0 },
        { cid: "EE", name: "Estonia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "ET", name: "Ethiopia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "FJ", name: "Fiji", visitedTimes: 0, plannedTimes: 0 },
        { cid: "FI", name: "Finland", visitedTimes: 0, plannedTimes: 0 },
        { cid: "FR", name: "France", visitedTimes: 0, plannedTimes: 0 },
        { cid: "FG", name: "French Guiana", visitedTimes: 0, plannedTimes: 0 },
        { cid: "GA", name: "Gabon", visitedTimes: 0, plannedTimes: 0 },
        { cid: "GM", name: "Gambia, The", visitedTimes: 0, plannedTimes: 0 },
        { cid: "GE", name: "Georgia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "DE", name: "Germany", visitedTimes: 0, plannedTimes: 0 },
        { cid: "GH", name: "Ghana", visitedTimes: 0, plannedTimes: 0 },
        { cid: "GR", name: "Greece", visitedTimes: 0, plannedTimes: 0 },
        { cid: "GL", name: "Greenland", visitedTimes: 0, plannedTimes: 0},
        { cid: "GD", name: "Grenada", visitedTimes: 0, plannedTimes: 0 },
        { cid: "GT", name: "Guatemala", visitedTimes: 0, plannedTimes: 0 },
        { cid: "GN", name: "Guinea", visitedTimes: 0, plannedTimes: 0 },
        { cid: "GW", name: "Guinea-Bissau", visitedTimes: 0, plannedTimes: 0 },
        { cid: "GY", name: "Guyana", visitedTimes: 0, plannedTimes: 0 },
        { cid: "HT", name: "Haiti", visitedTimes: 0, plannedTimes: 0 },
        { cid: "HN", name: "Honduras", visitedTimes: 0, plannedTimes: 0 },
        { cid: "HU", name: "Hungary", visitedTimes: 0, plannedTimes: 0 },
        { cid: "IS", name: "Iceland", visitedTimes: 0, plannedTimes: 0 },
        { cid: "IN", name: "India", visitedTimes: 0, plannedTimes: 0 },
        { cid: "ID", name: "Indonesia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "IR", name: "Iran", visitedTimes: 0, plannedTimes: 0 },
        { cid: "IQ", name: "Iraq", visitedTimes: 0, plannedTimes: 0 },
        { cid: "IE", name: "Ireland", visitedTimes: 0, plannedTimes: 0 },
        { cid: "IL", name: "Israel", visitedTimes: 0, plannedTimes: 0 },
        { cid: "IT", name: "Italy", visitedTimes: 0, plannedTimes: 0 },
        { cid: "JM", name: "Jamaica", visitedTimes: 0, plannedTimes: 0 },
        { cid: "JP", name: "Japan", visitedTimes: 0, plannedTimes: 0 },
        { cid: "JO", name: "Jordan", visitedTimes: 0, plannedTimes: 0 },
        { cid: "KZ", name: "Kazakhstan", visitedTimes: 0, plannedTimes: 0 },
        { cid: "KE", name: "Kenya", visitedTimes: 0, plannedTimes: 0 },
        { cid: "KI", name: "Kiribati", visitedTimes: 0, plannedTimes: 0 },
        { cid: "KP", name: "Korea, North", visitedTimes: 0, plannedTimes: 0 },
        { cid: "KR", name: "Korea, South", visitedTimes: 0, plannedTimes: 0 },
        { cid: "KS", name: "Kosovo", visitedTimes: 0, plannedTimes: 0 },
        { cid: "KW", name: "Kuwait", visitedTimes: 0, plannedTimes: 0 },
        { cid: "KG", name: "Kyrgyzstan", visitedTimes: 0, plannedTimes: 0 },
        { cid: "LA", name: "Laos", visitedTimes: 0, plannedTimes: 0 },
        { cid: "LV", name: "Latvia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "LB", name: "Lebanon", visitedTimes: 0, plannedTimes: 0 },
        { cid: "LS", name: "Lesotho", visitedTimes: 0, plannedTimes: 0 },
        { cid: "LR", name: "Liberia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "LY", name: "Libya", visitedTimes: 0, plannedTimes: 0 },
        { cid: "LI", name: "Liechtenstein", visitedTimes: 0, plannedTimes: 0 },
        { cid: "LT", name: "Lithuania", visitedTimes: 0, plannedTimes: 0 },
        { cid: "LU", name: "Luxembourg", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MK", name: "Macedonia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MG", name: "Madagascar", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MW", name: "Malawi", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MY", name: "Malaysia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MV", name: "Maldives", visitedTimes: 0, plannedTimes: 0 },
        { cid: "ML", name: "Mali", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MT", name: "Malta", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MH", name: "Marshall Islands", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MR", name: "Mauritania", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MU", name: "Mauritius", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MX", name: "Mexico", visitedTimes: 0, plannedTimes: 0 },
        { cid: "FM", name: "Micronesia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MD", name: "Moldova", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MC", name: "Monaco", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MN", name: "Mongolia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "ME", name: "Montenegro", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MA", name: "Morocco", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MZ", name: "Mozambique", visitedTimes: 0, plannedTimes: 0 },
        { cid: "MM", name: "Myanmar", visitedTimes: 0, plannedTimes: 0 },
        { cid: "NA", name: "Namibia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "NR", name: "Nauru", visitedTimes: 0, plannedTimes: 0 },
        { cid: "NP", name: "Nepal", visitedTimes: 0, plannedTimes: 0 },
        { cid: "NL", name: "Netherlands", visitedTimes: 0, plannedTimes: 0 },
        { cid: "NZ", name: "New Zealand", visitedTimes: 0, plannedTimes: 0 },
        { cid: "NI", name: "Nicaragua", visitedTimes: 0, plannedTimes: 0 },
        { cid: "NE", name: "Niger", visitedTimes: 0, plannedTimes: 0 },
        { cid: "NG", name: "Nigeria", visitedTimes: 0, plannedTimes: 0 },
        { cid: "NO", name: "Norway", visitedTimes: 0, plannedTimes: 0 },
        { cid: "OM", name: "Oman", visitedTimes: 0, plannedTimes: 0 },
        { cid: "PK", name: "Pakistan", visitedTimes: 0, plannedTimes: 0 },
        { cid: "PW", name: "Palau", visitedTimes: 0, plannedTimes: 0 },
        { cid: "PS", name: "Palestine, State of", visitedTimes: 0, plannedTimes: 0 },
        { cid: "PA", name: "Panama", visitedTimes: 0, plannedTimes: 0 },
        { cid: "PG", name: "Papua New Guinea", visitedTimes: 0, plannedTimes: 0 },
        { cid: "PY", name: "Paraguay", visitedTimes: 0, plannedTimes: 0 },
        { cid: "PE", name: "Peru", visitedTimes: 0, plannedTimes: 0 },
        { cid: "PH", name: "Philippines", visitedTimes: 0, plannedTimes: 0 },
        { cid: "PL", name: "Poland", visitedTimes: 0, plannedTimes: 0 },
        { cid: "PT", name: "Portugal", visitedTimes: 0, plannedTimes: 0 },
        { cid: "QA", name: "Qatar", visitedTimes: 0, plannedTimes: 0 },
        { cid: "RO", name: "Romania", visitedTimes: 0, plannedTimes: 0 },
        { cid: "RU", name: "Russia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "RW", name: "Rwanda", visitedTimes: 0, plannedTimes: 0 },
        {
          cid: "KN",
          name: "Saint Kitts and Nevis",
          visitedTimes: 0,
          plannedTimes: 0,
        },
        { cid: "LC", name: "Saint Lucia", visitedTimes: 0, plannedTimes: 0 },
        {
          cid: "VC",
          name: "Saint Vincent and the Grenadines",
          visitedTimes: 0,
          plannedTimes: 0,
        },
        { cid: "WS", name: "Samoa", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SM", name: "San Marino", visitedTimes: 0, plannedTimes: 0 },
        {
          cid: "ST",
          name: "Sao Tome and Principe",
          visitedTimes: 0,
          plannedTimes: 0,
        },
        { cid: "SA", name: "Saudi Arabia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SN", name: "Senegal", visitedTimes: 0, plannedTimes: 0 },
        { cid: "RS", name: "Serbia", visitedTimes: 0, plannedTimes: 0 },
        {
          cid: "CS",
          name: "Serbia and Montenegro",
          visitedTimes: 0,
          plannedTimes: 0,
        },
        { cid: "SC", name: "Seychelles", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SL", name: "Sierra Leone", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SG", name: "Singapore", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SK", name: "Slovakia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SI", name: "Slovenia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SB", name: "Solomon Islands", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SO", name: "Somalia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "ZA", name: "South Africa", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SS", name: "South Sudan", visitedTimes: 0, plannedTimes: 0 },
        { cid: "ES", name: "Spain", visitedTimes: 0, plannedTimes: 0 },
        { cid: "LK", name: "Sri Lanka", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SD", name: "Sudan", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SR", name: "Suriname", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SJ", name: "Svalbard and Jan Mayen", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SZ", name: "Swaziland", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SE", name: "Sweden", visitedTimes: 0, plannedTimes: 0 },
        { cid: "CH", name: "Switzerland", visitedTimes: 0, plannedTimes: 0 },
        { cid: "SY", name: "Syria", visitedTimes: 0, plannedTimes: 0 },
        { cid: "TW", name: "Taiwan", visitedTimes: 0, plannedTimes: 0 },
        { cid: "TJ", name: "Tajikistan", visitedTimes: 0, plannedTimes: 0 },
        { cid: "TZ", name: "Tanzania", visitedTimes: 0, plannedTimes: 0 },
        { cid: "TH", name: "Thailand", visitedTimes: 0, plannedTimes: 0 },
        { cid: "TG", name: "Togo", visitedTimes: 0, plannedTimes: 0 },
        { cid: "TO", name: "Tonga", visitedTimes: 0, plannedTimes: 0 },
        { cid: "TT", name: "Trinidad and Tobago", visitedTimes: 0, plannedTimes: 0 },
        { cid: "TN", name: "Tunisia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "TR", name: "Turkey", visitedTimes: 0, plannedTimes: 0 },
        { cid: "TM", name: "Turkmenistan", visitedTimes: 0, plannedTimes: 0 },
        { cid: "TV", name: "Tuvalu", visitedTimes: 0, plannedTimes: 0 },
        { cid: "UG", name: "Uganda", visitedTimes: 0, plannedTimes: 0 },
        { cid: "UA", name: "Ukraine", visitedTimes: 0, plannedTimes: 0 },
        { cid: "AE", name: "United Arab Emirates", visitedTimes: 0, plannedTimes: 0 },
        { cid: "GB", name: "United Kingdom", visitedTimes: 0, plannedTimes: 0 },
        { cid: "US", name: "United States", visitedTimes: 0, plannedTimes: 0 },
        { cid: "UY", name: "Uruguay", visitedTimes: 0, plannedTimes: 0 },
        { cid: "UZ", name: "Uzbekistan", visitedTimes: 0, plannedTimes: 0 },
        { cid: "VU", name: "Vanuatu", visitedTimes: 0, plannedTimes: 0 },
        { cid: "VA", name: "Vatican City", visitedTimes: 0, plannedTimes: 0 },
        { cid: "VE", name: "Venezuela", visitedTimes: 0, plannedTimes: 0 },
        { cid: "VN", name: "Vietnam", visitedTimes: 0, plannedTimes: 0 },
        { cid: "EH", name: "Western Sahara", visitedTimes: 0, plannedTimes: 0 },
        { cid: "YE", name: "Yemen", visitedTimes: 0, plannedTimes: 0 },
        { cid: "ZM", name: "Zambia", visitedTimes: 0, plannedTimes: 0 },
        { cid: "ZW", name: "Zimbabwe", visitedTimes: 0, plannedTimes: 0 },
      ];

const users = [
    {
        username: "testAdmin",
        role: "admin",
        nationality: "Chinese",
        email: "testAdmin@ironhack.com",
        passwordHash: bcrypt.hashSync("Admin123!", bcrypt.genSaltSync(bcryptSalt)),
        visitedCountries: [
            {
                from:{
                    country: "China",
                    coordinates: [116.4074, 39.9042] 
                    // Beijing, 
                    // Coordinates may differ from users who visited China
                    // This will depend on where they click on the map  
                },
                to:{
                    country: "United States",
                    coordinates: [-95.7129, 37.0902]
                }
            },
            {
                from:{
                    country: "United States",
                    coordinates: [-95.7129, 37.0902]
                },
                to:{
                    country: "Mexico",
                    coordinates: [-99.1332, 19.4326]
                }
            }
        ],
        plannedCountries: ["Australia","Canada","France","Germany","Italy","Japan","Mexico"]
        
    },
    {
        username: "testUser",
        role: "user",
        nationality: "American",
        email: "testUser@ironhack.com",
        passwordHash: bcrypt.hashSync("User123!", bcrypt.genSaltSync(bcryptSalt)),
        visitedCountries: [
            {
                from:{
                    country: "China",
                    coordinates: [116.4074, 39.9042] 
                    // Coordinates may differ from users who visited China
                    // This will depend on where they click on the map  
                },
                to:{
                    country: "United States",
                    coordinates: [-95.7129, 37.0902]
                }
            },
            {
                from:{
                    country: "United States",
                    coordinates: [-95.7129, 37.0902]
                },
                to:{
                    country: "Mexico",
                    coordinates: [-99.1332, 19.4326]
                }
            }
        ],
        plannedCountries: [
            "France","Germany","Japan","Mexico","Spain"
        ]
    }
]


const MONGO_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/countries-tracker'

console.log(MONGO_URL)
mongoose
    .connect(MONGO_URL, { useNewUrlParser: true })
    .then((x) => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)

        Country.create(countries)
            .then((countries) => {
                console.log(`Created ${countries.length} countries`)
                mongoose.connection.close()
            })
            .catch((err) => {
                console.log("Error creating countries: ", err)
            })
        
        User.create(users)
            .then((users) => {
                console.log(`Created ${users.length} users`)
                mongoose.connection.close()
            })
            .catch((err) => {
                console.log("Error creating users: ", err)
            })
    })
    .catch((err) => {
        console.error('Error connecting to mongo', err)
    })





