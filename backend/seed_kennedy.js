const mongoose = require('mongoose');
const { connectDB } = require('./config/database');

async function run() {
  await mongoose.connect('mongodb+srv://barkhurdarworks_db_user:scolarfixmerizindagifixkrdo@scolar-fix.nj5stnu.mongodb.net/scolar-fix');
  const University = require('./models/University');
  
  await University.deleteMany({}); // clear everything just in case

  const kennedys = [
    {
      name: "Kennedy University",
      country: "Global",
      logoUrl: "https://www.kennedy.edu.eu/wp-content/uploads/2023/12/logo-kennedy.png",
      partnershipType: "Academic",
      slug: "kennedy-university",
      description: "Kennedy University is an internationally recognised institution offering accredited programmes across business, education, health, law and social sciences. Its diverse global community and research-led environment attract students from over 60 countries worldwide.",
      shortDescription: "Kennedy University is an internationally recognised institution offering accredited programmes across business, education, health, law and social sciences."
    },
    {
      name: "Kennedy University of Baptist",
      country: "Global",
      logoUrl: "",
      partnershipType: "Academic",
      slug: "kennedy-university-of-baptist",
      description: "Kennedy University of Baptist delivers academically rigorous programmes with a foundation in ethical leadership, research excellence and professional development. Students benefit from dedicated faculty mentorship and a strong academic community.",
      shortDescription: "Kennedy University of Baptist delivers academically rigorous programmes with a foundation in ethical leadership, research excellence and professional development."
    }
  ];

  await University.insertMany(kennedys);
  console.log("Successfully inserted the Kennedy universities!");
  
  await mongoose.disconnect();
}

run().catch(console.error);
