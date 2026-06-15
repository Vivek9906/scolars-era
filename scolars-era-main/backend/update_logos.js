const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function run() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGO_URI missing in .env");
    return;
  }
  await mongoose.connect(uri);
  const University = require('./models/University');

  // Update Kennedy University
  await University.updateOne(
    { slug: "kennedy-university" },
    { $set: { logoUrl: "/assets/images/kennedy_logo.jpeg" } }
  );

  // Update Kennedy University of Baptist
  await University.updateOne(
    { slug: "kennedy-university-of-baptist" },
    { $set: { logoUrl: "/assets/images/kennedy_baptist_logo.png" } }
  );

  console.log("Updated logos in DB!");
  await mongoose.disconnect();
}

run().catch(console.error);
