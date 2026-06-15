"use strict";

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const slugify = (text) =>
  text.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

// Load .env file
dotenv.config({ path: path.join(__dirname, ".env") });

// Models
const User = require("./backend/models/User");
const Course = require("./backend/models/Course");
const University = require("./backend/models/University");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1);
}

const seedData = async () => {
  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ MongoDB Connected.");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Course.deleteMany({});
    await University.deleteMany({});

    // Seed Admin User
    console.log("Seeding admin user...");
    await User.create({
      name: "Super Admin",
      email: "admin@scolarsfix.com",
      password: "password123", // Will be hashed automatically by the pre-save hook
      role: "admin",
      isEmailVerified: true,
    });

    // Seed Courses
    console.log("Seeding courses...");
    await Course.insertMany([
      {
        title: "Advanced AI & Machine Learning",
        shortDescription: "Master AI and Machine Learning concepts.",
        description: "A comprehensive course covering neural networks, deep learning, and advanced AI systems.",
        category: "Technology",
        level: "Advanced",
        durationWeeks: 12,
        price: 0,
        isFree: true,
        features: ["Hands-on projects", "Certificate of completion", "Expert mentors"],
        registrationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      },
      {
        title: "Business Leadership Strategy",
        shortDescription: "Develop essential leadership skills for the corporate world.",
        description: "Learn how to manage teams, negotiate effectively, and build a successful business strategy.",
        category: "Business",
        level: "Intermediate",
        durationWeeks: 8,
        price: 0,
        isFree: true,
        features: ["Live case studies", "Networking opportunities"],
        registrationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      },
    ]);

    // Seed Universities
    console.log("Seeding universities...");
    await University.insertMany([
      {
        name: "Global Tech University",
        country: "USA",
        partnershipType: "Academic",
        description: "Leading institution in technology and innovation.",
        type: "Private",
        established: "1985",
        location: "Silicon Valley, CA",
        isActive: true,
      },
      {
        name: "London Business Institute",
        country: "UK",
        partnershipType: "Academic",
        description: "Renowned business school with a global alumni network.",
        type: "Public",
        established: "1902",
        location: "London, UK",
        isActive: true,
      },
    ]);

    console.log("✅ Seed completed successfully! You can now log in with admin@scolarsfix.com / password123");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedData();
