const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb+srv://barkhurdarworks_db_user:scolarfixmerizindagifixkrdo@scolar-fix.nj5stnu.mongodb.net/scolar-fix');
  
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
