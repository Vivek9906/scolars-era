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
  
  const all = await University.find({});
  console.log("Total universities before:", all.length);

  // keep only those with 'kennedy' in name
  const result = await University.deleteMany({ name: { $not: /kennedy/i } });
  console.log("Deleted count:", result.deletedCount);

  const remaining = await University.find({});
  console.log("Remaining universities:", remaining.map(u => u.name));

  await mongoose.disconnect();
}

run().catch(console.error);
