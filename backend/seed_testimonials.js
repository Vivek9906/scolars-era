const mongoose = require("mongoose");
const connectDB = require("./config/database");
const Testimonial = require("./models/Testimonial");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const testimonials = [
  {
    studentName: "Adebayo Okonkwo",
    studentRole: "Nigeria",
    studentAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
    content: "At 61, I wanted to pursue an academic PhD but had no idea where to start given my career path. Their team guided me through the research proposal stage and helped me find a program that valued professional experience, not just academic history.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Hiroshi Tanaka",
    studentRole: "Japan",
    studentAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
    content: "I was exploring the honorary PhD route to recognize decades of work in my field. Their consultants explained the process clearly, helped me put together the right documentation, and made something that felt intimidating much more manageable.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Klaus Richter",
    studentRole: "Germany",
    studentAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
    content: "Choosing to pursue a PhD later in my career felt overwhelming. Their advisors didn't just point me to a university, they helped me shape my research direction and refine my proposal before I even applied.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Rajendra Mehta",
    studentRole: "India",
    studentAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
    content: "I appreciated their honesty from the start. Rather than pushing me toward the fastest option, they helped me think through my research interests properly before recommending where to apply.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Carlos Fuentes",
    studentRole: "Mexico",
    studentAvatar: "https://randomuser.me/api/portraits/men/5.jpg",
    content: "I was considering an honorary PhD to reflect my years in public service. Their team walked me through what that actually involves and helped me build a case that genuinely represented my contributions.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Ibrahim Al-Sayed",
    studentRole: "Egypt",
    studentAvatar: "https://randomuser.me/api/portraits/men/6.jpg",
    content: "Having mentored many students myself, I know what proper research guidance looks like. Their consultants gave me real, substantive feedback on my proposal, not just administrative help.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Lars Eriksson",
    studentRole: "Sweden",
    studentAvatar: "https://randomuser.me/api/portraits/men/7.jpg",
    content: "I wanted data, not sales talk, before committing to a PhD program. They gave me a clear, evidence based comparison of paths and helped me structure my research plan with real rigor.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "William Osei",
    studentRole: "Ghana",
    studentAvatar: "https://randomuser.me/api/portraits/men/8.jpg",
    content: "Pursuing an honorary PhD later in life felt like uncharted territory. Their team made the process transparent and supported me every step of the way, from documentation to final submission.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Antoine Dubois",
    studentRole: "France",
    studentAvatar: "https://randomuser.me/api/portraits/men/9.jpg",
    content: "I've seen many consultancies overpromise on PhD guidance. This one was different, thoughtful research support, honest timelines, and no pressure to rush a decision that deserved care.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Michael Thompson",
    studentRole: "Australia",
    studentAvatar: "https://randomuser.me/api/portraits/men/10.jpg",
    content: "Retirement gave me time to finally pursue the PhD I'd always wanted. Their consultants helped me refine my research question and pick a path that suited where I was in life, not just what was easiest.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Elena Castillo",
    studentRole: "Spain",
    studentAvatar: "https://randomuser.me/api/portraits/women/11.jpg",
    content: "I wanted to strengthen my case for a professorship appointment, but wasn't sure how to position my research portfolio. Their consultants helped me sharpen my publication strategy and guided me toward opportunities that actually matched my field.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Samuel Nkemelu",
    studentRole: "Kenya",
    studentAvatar: "https://randomuser.me/api/portraits/men/12.jpg",
    content: "Working toward a professorship while teaching full time left me little room to figure out the process alone. Their team helped me map out a realistic path, from strengthening my research profile to identifying the right institutions to approach.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Wei Chen",
    studentRole: "Singapore",
    studentAvatar: "https://randomuser.me/api/portraits/men/13.jpg",
    content: "I'd built curricula for years but had no clear roadmap toward a professorship title. Their advisors helped me understand what evaluators actually look for and supported me in shaping a stronger academic case.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "David Kessler",
    studentRole: "United States",
    studentAvatar: "https://randomuser.me/api/portraits/men/14.jpg",
    content: "I knew I wanted an MBA but was overwhelmed by how many programs claimed to be the right fit. Their consultants gave me a straight, no nonsense comparison and helped me apply to a program that matched my career goals.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Priya Sharma",
    studentRole: "United Arab Emirates",
    studentAvatar: "https://randomuser.me/api/portraits/women/15.jpg",
    content: "Balancing a full time role with MBA applications felt impossible until their team stepped in. They helped me shortlist programs realistically and guided me through the entire application process without the usual pressure tactics.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Fatima Zahra",
    studentRole: "Morocco",
    studentAvatar: "https://randomuser.me/api/portraits/women/16.jpg",
    content: "I had a research area in mind but no clear sense of which master's program would support it properly. Their consultants took the time to understand my interests and helped me build a strong application around them.",
    rating: 5,
    isFeatured: true,
  },
  {
    studentName: "Julian Novak",
    studentRole: "Czech Republic",
    studentAvatar: "https://randomuser.me/api/portraits/men/17.jpg",
    content: "I expected a generic referral service when I reached out about pursuing a master's degree. Instead, their team laid out honest trade offs between programs and helped me choose one that truly aligned with my goals",
    rating: 5,
    isFeatured: true,
  }
];

async function seed() {
  try {
    await connectDB();
    await Testimonial.deleteMany();
    await Testimonial.insertMany(testimonials);
    console.log("Testimonials seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
