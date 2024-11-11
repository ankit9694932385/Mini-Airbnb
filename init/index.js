const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initdata = require("./listingData.js");

main()
  .then((res) => {
    console.log("connection successfull");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

let initDb = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "67024e84de57852114de57ee",
  }));
  await Listing.insertMany(initdata.data);
  console.log("data saved");
};

initDb();
