const { Schema, model } = require("mongoose");

const countrySchema = new Schema(
    {
        cid: {
          type: String,
          required: true,
          unique: true,
          trim: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        visitedTimes: {
            type: Number,
            default: 0,
        },
        plannedTimes: {
            type: Number,
            default: 0,
        },
        emoji: {
            type: String,
        },
        /* Optional
        description: {
            type: String,
            required: true,
            trim: true,
        }
        */
    },
    {
        timestamps: true,
    }
);

module.exports = model("Country", countrySchema);


