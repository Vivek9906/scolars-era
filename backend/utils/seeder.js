// scholars-era/backend/utils/seeder.js
"use strict";

const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/database");
const University = require("../models/University");
const Course = require("../models/Course");
const Testimonial = require("../models/Testimonial");
const User = require("../models/User");

// ── University seed data (from universities.json) ─────────────────────────────
const universitySeedData = [
  {
    name: "Harvard University",
    slug: "harvard-university",
    logo: "/assets/images/harvard.png",
    websiteUrl: "https://www.harvard.edu",
    country: "USA",
    location: "Cambridge, Massachusetts, USA",
    partnershipType: "Academic",
    tagline: "Veritas — Truth, Excellence & Global Leadership",
    type: "Private Ivy League Research University",
    established: "1636",
    description: "Harvard University, founded in 1636, is the oldest institution of higher education in the United States. A private Ivy League research university renowned for its academic excellence and groundbreaking research.",
    sortOrder: 1,
  },
  {
    name: "Massachusetts Institute of Technology (MIT)",
    slug: "mit",
    logo: "/assets/images/stanford.png",
    websiteUrl: "https://www.mit.edu",
    country: "USA",
    location: "Cambridge, Massachusetts, USA",
    partnershipType: "Academic",
    tagline: "Mens et Manus — Mind and Hand",
    type: "Private Research University",
    established: "1861",
    description: "The Massachusetts Institute of Technology (MIT) is a world-renowned private research university globally recognized as the premier institution for science, technology, engineering, and mathematics.",
    sortOrder: 2,
  },
  {
    name: "University of Oxford",
    slug: "oxford-university",
    logo: "/assets/images/oxford.png",
    websiteUrl: "https://www.ox.ac.uk",
    country: "UK",
    location: "Oxford, Oxfordshire, United Kingdom",
    partnershipType: "Academic",
    tagline: "Dominus Illuminatio Mea — The Lord is My Light",
    type: "Public Research University (Collegiate)",
    established: "1096",
    description: "The University of Oxford is the oldest university in the English-speaking world, a collegiate research university comprising 39 semi-autonomous colleges.",
    sortOrder: 3,
  },
  {
    name: "University of Cambridge",
    slug: "cambridge-university",
    logo: "/assets/images/cambridge.png",
    websiteUrl: "https://www.cam.ac.uk",
    country: "UK",
    location: "Cambridge, Cambridgeshire, United Kingdom",
    partnershipType: "Academic",
    tagline: "Hinc lucem et pocula sacra — From here, light and sacred draughts",
    type: "Public Collegiate Research University",
    established: "1209",
    description: "The University of Cambridge is one of the world's oldest and most prestigious universities, organized into 31 colleges and 150 departments. Home to 121 Nobel laureates.",
    sortOrder: 4,
  },
  {
    name: "Stanford University",
    slug: "stanford-university",
    logo: "/assets/images/stanford.png",
    websiteUrl: "https://www.stanford.edu",
    country: "USA",
    location: "Stanford, California, USA",
    partnershipType: "Academic",
    tagline: "Die Luft der Freiheit weht — The wind of freedom blows",
    type: "Private Research University",
    established: "1885",
    description: "Stanford University is situated in Silicon Valley and is one of the world's leading research and teaching institutions, famous for producing Silicon Valley entrepreneurs.",
    sortOrder: 5,
  },
  {
    name: "University of Toronto",
    slug: "university-of-toronto",
    logo: "/assets/images/toronto.png",
    websiteUrl: "https://www.utoronto.ca",
    country: "Canada",
    location: "Toronto, Ontario, Canada",
    partnershipType: "Academic",
    tagline: "Velut Arbor Ævo — As a Tree Through the Ages",
    type: "Public Research University",
    established: "1827",
    description: "The University of Toronto is Canada's largest and most prestigious university, home to more than 97,000 students and a global leader in AI research.",
    sortOrder: 6,
  },
];

// ── Course seed data (matching scholars Fix real course pages) ─────────────────
const courseSeedData = [
  {
    title: "Bachelor of Education (B.Ed)",
    slug: "b-ed",
    shortDescription: "A 2-year undergraduate professional degree that prepares students for teaching at secondary and higher secondary levels.",
    description: "Bachelor of Education (B.Ed) is an undergraduate professional degree that prepares students for work as a teacher in schools. It is mandatory for teaching at the secondary (classes 6–10) and higher secondary (classes 11–12) divisions. The program covers child psychology, pedagogy, curriculum development, and teaching methodologies that shape effective educators.",
    category: "Education",
    level: "Intermediate",
    durationWeeks: 104,
    price: 55,
    thumbnail: "/assets/images/course1.jpeg",
    features: [
      "Childhood and Growing Up",
      "Contemporary India and Education",
      "Learning and Teaching methodologies",
      "Pedagogy of School Subjects",
      "Assessment for Learning",
    ],
    sortOrder: 1,
  },
  {
    title: "Master of Education (M.Ed)",
    slug: "m-ed",
    shortDescription: "A 2-year postgraduate degree in education focusing on advanced research, administration, and educational leadership.",
    description: "Master of Education (M.Ed) is a postgraduate degree that deepens understanding of educational theories, research methods, and leadership. Designed for practicing educators who want to advance their career into educational administration, curriculum design, or academic research. This program equips you with advanced skills to lead schools, design curricula, and contribute to educational policy.",
    category: "Education",
    level: "Advanced",
    durationWeeks: 104,
    price: 55,
    thumbnail: "/assets/images/course1.jpeg",
    features: [
      "Advanced Educational Research Methods",
      "Educational Leadership and Administration",
      "Curriculum Design and Development",
      "Comparative and International Education",
      "Dissertation / Research Project",
    ],
    sortOrder: 2,
  },
  {
    title: "Bachelor of Science (B.Sc)",
    slug: "b-sc",
    shortDescription: "A 3-year undergraduate science degree covering Physics, Chemistry, Mathematics, Biology, and Computer Science streams.",
    description: "Bachelor of Science (B.Sc) is a 3-year undergraduate degree program covering fundamental and applied sciences. Students can choose from streams including Physics, Chemistry, Mathematics, Biology, and Computer Science. The program builds a strong foundation in scientific reasoning, laboratory skills, and analytical thinking—preparing graduates for research, industry, or further postgraduate studies.",
    category: "Science",
    level: "Beginner",
    durationWeeks: 156,
    price: 50,
    thumbnail: "/assets/images/course6.jpeg",
    features: [
      "Multiple specialization streams available",
      "Hands-on laboratory sessions",
      "Industry-relevant curriculum",
      "Research project in final year",
      "Pathway to M.Sc and PhD programs",
    ],
    sortOrder: 3,
  },
  {
    title: "Master of Science (M.Sc)",
    slug: "m-sc",
    shortDescription: "A 2-year postgraduate science degree with specializations in Physics, Chemistry, Maths, Biotechnology, and more.",
    description: "Master of Science (M.Sc) is a 2-year postgraduate program offering advanced study in specialized scientific disciplines. Students engage in research, seminars, and laboratory work designed to build expertise in their chosen field. Graduates are well-positioned for PhD programs, research institutions, or high-level industry positions in science and technology sectors.",
    category: "Science",
    level: "Advanced",
    durationWeeks: 104,
    price: 60,
    thumbnail: "/assets/images/course4.jpeg",
    features: [
      "Advanced specialization topics",
      "Dedicated research component",
      "Access to top university partnerships",
      "Industry internship opportunities",
      "Preparation for PhD programs",
    ],
    sortOrder: 4,
  },
  {
    title: "Master of Technology (M.Tech)",
    slug: "m-tech",
    shortDescription: "A 2-year postgraduate engineering degree in Computer Science, Electronics, Mechanical, Civil, and other branches.",
    description: "Master of Technology (M.Tech) is a 2-year postgraduate engineering and technology degree that provides advanced knowledge in specialized engineering disciplines. The program combines theory, research, and practical application. Students work on cutting-edge projects, collaborate with industry partners, and develop expertise that positions them as leaders in their engineering field.",
    category: "Technology",
    level: "Advanced",
    durationWeeks: 104,
    price: 75,
    thumbnail: "/assets/images/course3.jpeg",
    features: [
      "Multiple engineering specializations",
      "Industry-sponsored projects",
      "Advanced laboratory and simulation facilities",
      "Research thesis in final semester",
      "100% placement support",
    ],
    sortOrder: 5,
  },
  {
    title: "PhD Research Guidance Program",
    slug: "phd-research",
    shortDescription: "Comprehensive end-to-end support for PhD aspirants — from topic selection to thesis submission and viva preparation.",
    description: "Our PhD Research Guidance Program provides comprehensive support to doctoral aspirants at every stage of their research journey. From identifying a viable research topic and obtaining UGC-approved enrollment to writing your thesis, publishing in indexed journals, and preparing for your viva — our expert team of academics guides you through every step. Designed for working professionals and full-time researchers alike.",
    category: "Education",
    level: "Advanced",
    durationWeeks: 208,
    price: 0,
    thumbnail: "/assets/images/course5.jpeg",
    features: [
      "Topic identification and literature review support",
      "UGC-approved university enrollment assistance",
      "Thesis / Dissertation writing and editing",
      "Publication support in Scopus / UGC-CARE journals",
      "Viva / defense preparation",
    ],
    sortOrder: 6,
  },
];

// ── Testimonial seed data ──────────────────────────────────────────────────────
const testimonialSeedData = [
  {
    studentName: "Sarah Johnson",
    studentRole: "Web Developer",
    studentAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    content: "scholars Fix has completely transformed my career path. The counsellors are knowledgeable and supportive. They helped me secure admission to my dream university without any stress. I highly recommend their services to anyone looking for genuine academic guidance.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Michael Chen",
    studentRole: "Data Analyst",
    studentAvatar: "https://images.unsplash.com/photo-1506863530036-1ef8d1644ce8?auto=format&fit=crop&w=400&q=80",
    content: "The flexibility of the guidance process allowed me to work and pursue my M.Sc simultaneously. scholars Fix's team was always available to answer my queries. Their university partnerships are world-class and the admission support is second to none.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Emily Davis",
    studentRole: "Graphic Designer",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    content: "I love the community here. The resources are endless and the support team is always there to help. Getting into my B.Ed program felt impossible before I found scholars Fix. They made the entire admission journey smooth and stress-free.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Rajesh Kumar",
    studentRole: "School Principal",
    studentAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    content: "After 15 years in teaching, I wanted a M.Ed to advance to school leadership. scholars Fix guided me through every step — from selecting the right university to completing my documentation. The support was exceptional throughout.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Priya Sharma",
    studentRole: "Research Scholar",
    studentAvatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80",
    content: "scholars Fix's PhD guidance program is outstanding. My mentor helped me identify a unique research topic, assisted with journal publications, and prepared me thoroughly for my viva. I successfully defended my thesis after 3 years.",
    rating: 5,
    isFeatured: false,
  },
  {
    studentName: "James Wilson",
    studentRole: "Software Engineer",
    studentAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    content: "The M.Tech program support from scholars Fix was fantastic. They matched me with the right university for my specialization in AI and helped me throughout the admission process. Highly professional team.",
    rating: 4,
    isFeatured: false,
  },
  {
    studentName: "Anita Patel",
    studentRole: "Science Teacher",
    studentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    content: "I enrolled in the B.Sc program through scholars Fix's guidance. The counsellors were patient, knowledgeable, and genuinely cared about my success. The university they recommended was perfect for my career goals.",
    rating: 5,
    isFeatured: false,
  },
  {
    studentName: "David Thompson",
    studentRole: "Education Consultant",
    studentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    content: "Outstanding platform for academic guidance. scholars Fix helped me understand the entire landscape of postgraduate education in the UK and India. Their research support services are particularly impressive.",
    rating: 4,
    isFeatured: false,
  }
];

// ── Seeder functions ───────────────────────────────────────────────────────────
async function importData() {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      University.deleteMany(),
      Course.deleteMany(),
      Testimonial.deleteMany(),
      User.deleteMany(),
    ]);
    console.log("✅ Existing data cleared");

    // Seed universities
    await University.insertMany(universitySeedData, { ordered: false });
    console.log(`✅ ${universitySeedData.length} universities seeded`);

    // Seed courses (use save() to trigger pre-save hook for slug)
    for (const courseData of courseSeedData) {
      const course = new Course(courseData);
      await course.save();
    }
    console.log(`✅ ${courseSeedData.length} courses seeded`);

    // Seed testimonials
    await Testimonial.insertMany(testimonialSeedData, { ordered: false });
    console.log(`✅ ${testimonialSeedData.length} testimonials seeded`);

    // Seed admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@scholarslift.com";
    const adminUser = new User({
      name: "scholars Fix Admin",
      email: adminEmail,
      password: "Admin@scholars1",
      role: "admin",
      isEmailVerified: true,
    });
    await adminUser.save();
    console.log(`✅ Admin user created: ${adminEmail}`);
    console.warn("⚠️  Default admin password is Admin@scholars1 — CHANGE IT NOW");

    console.log("\n🎉 Database seeded successfully!\n");
    process.exit(0);
  } catch (err) {
    console.error(`❌ Seeder error: ${err.message}`);
    process.exit(1);
  }
}

async function deleteData() {
  try {
    await connectDB();
    await Promise.all([
      University.deleteMany(),
      Course.deleteMany(),
      Testimonial.deleteMany(),
      User.deleteMany(),
    ]);
    console.log("✅ All collections dropped successfully");
    process.exit(0);
  } catch (err) {
    console.error(`❌ Delete error: ${err.message}`);
    process.exit(1);
  }
}

// ── Entry point ───────────────────────────────────────────────────────────────
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
} else {
  console.log("Usage:");
  console.log("  node backend/utils/seeder.js --import   Import seed data");
  console.log("  node backend/utils/seeder.js --delete   Delete all data");
  process.exit(0);
}



