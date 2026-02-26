const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlSchema = new Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    shortUrl: {
      type: String,
      required: false,
    },
    redirectUrl: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    visitHistory: [{ timestamps: { type: Number } }],
  },
  {
    timestamps: true,
  }
);

const URL = mongoose.model("URL", urlSchema);

module.exports = URL;
