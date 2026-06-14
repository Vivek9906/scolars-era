const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb+srv://barkhurdarworks_db_user:scolarfixmerizindagifixkrdo@scolar-fix.nj5stnu.mongodb.net/scolar-fix');
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
