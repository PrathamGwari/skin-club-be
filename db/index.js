const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config()

const mongoURI = process.env.MONGO_URL

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Anti wrinkle injections - 3 areas Flat fee
// Bio remodelling - $595 per syringe Flat fee
