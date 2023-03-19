const Country = require("../models/Country.model");
const User = require("../models/User.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
require("dotenv").config();

const countries = [
    // countries in total: 193, should be consistent with the enum in User.model.js and map.js library
    { name: 'Afghanistan', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Albania', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Algeria', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Andorra', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Angola', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Antigua and Barbuda', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Argentina', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Armenia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Australia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Austria', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Azerbaijan', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Bahamas', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Bahrain', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Bangladesh', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Barbados', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Belarus', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Belgium', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Belize', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Benin', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Bhutan', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Bolivia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Bosnia and Herzegovina', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Botswana', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Brazil', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Brunei', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Bulgaria', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Burkina Faso', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Burundi', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Cambodia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Cameroon', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Canada', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Cape Verde', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Central African Republic', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Chad', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Chile', visitedTimes: 0, plannedTimes: 0 },
    { name: 'China', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Colombia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Comoros', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Congo (Brazzaville)', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Congo', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Costa Rica', visitedTimes: 0, plannedTimes: 0 },
    { name: "Cote d'Ivoire", visitedTimes: 0, plannedTimes: 0 },
    { name: 'Croatia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Cuba', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Cyprus', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Czech Republic', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Denmark', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Djibouti', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Dominica', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Dominican Republic', visitedTimes: 0, plannedTimes: 0 },
    { name: 'East Timor (Timor Timur)', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Ecuador', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Egypt', visitedTimes: 0, plannedTimes: 0 },
    { name: 'El Salvador', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Equatorial Guinea', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Eritrea', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Estonia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Ethiopia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Fiji', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Finland', visitedTimes: 0, plannedTimes: 0 },
    { name: 'France', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Gabon', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Gambia, The', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Georgia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Germany', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Ghana', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Greece', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Grenada', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Guatemala', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Guinea', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Guinea-Bissau', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Guyana', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Haiti', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Honduras', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Hungary', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Iceland', visitedTimes: 0, plannedTimes: 0 },
    { name: 'India', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Indonesia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Iran', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Iraq', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Ireland', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Israel', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Italy', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Jamaica', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Japan', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Jordan', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Kazakhstan', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Kenya', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Kiribati', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Korea, North', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Korea, South', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Kuwait', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Kyrgyzstan', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Laos', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Latvia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Lebanon', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Lesotho', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Liberia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Libya', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Liechtenstein', visitedTimes: 0, plannedTimes: 0 },    
    { name: 'Lithuania', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Luxembourg', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Macedonia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Madagascar', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Malawi', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Malaysia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Maldives', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Mali', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Malta', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Marshall Islands', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Mauritania', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Mauritius', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Mexico', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Micronesia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Moldova', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Monaco', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Mongolia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Morocco', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Mozambique', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Myanmar', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Namibia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Nauru', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Nepal', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Netherlands', visitedTimes: 0, plannedTimes: 0 },
    { name: 'New Zealand', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Nicaragua', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Niger', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Nigeria', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Norway', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Oman', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Pakistan', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Palau', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Panama', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Papua New Guinea', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Paraguay', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Peru', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Philippines', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Poland', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Portugal', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Qatar', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Romania', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Russia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Rwanda', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Saint Kitts and Nevis', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Saint Lucia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Saint Vincent and the Grenadines', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Samoa', visitedTimes: 0, plannedTimes: 0 },
    { name: 'San Marino', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Sao Tome and Principe', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Saudi Arabia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Senegal', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Serbia and Montenegro', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Seychelles', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Sierra Leone', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Singapore', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Slovakia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Slovenia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Solomon Islands', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Somalia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'South Africa', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Spain', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Sri Lanka', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Sudan', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Suriname', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Swaziland', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Sweden', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Switzerland', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Syria', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Taiwan', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Tajikistan', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Tanzania', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Thailand', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Togo', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Tonga', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Trinidad and Tobago', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Tunisia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Turkey', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Turkmenistan', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Tuvalu', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Uganda', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Ukraine', visitedTimes: 0, plannedTimes: 0 },
    { name: 'United Arab Emirates', visitedTimes: 0, plannedTimes: 0 },
    { name: 'United Kingdom', visitedTimes: 0, plannedTimes: 0 },
    { name: 'United States', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Uruguay', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Uzbekistan', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Vanuatu', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Vatican City', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Venezuela', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Vietnam', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Yemen', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Zambia', visitedTimes: 0, plannedTimes: 0 },
    { name: 'Zimbabwe', visitedTimes: 0, plannedTimes: 0}
]

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





