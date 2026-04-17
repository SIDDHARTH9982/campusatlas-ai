require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Institution = require('../models/Institution');
const StudentPurchase = require('../models/StudentPurchase');
const Course = require('../models/Course');
const Department = require('../models/Department');
const FeeStructure = require('../models/FeeStructure');
const Scholarship = require('../models/Scholarship');
const HostelInfo = require('../models/HostelInfo');
const PlacementRecord = require('../models/PlacementRecord');
const Notice = require('../models/Notice');
const FAQ = require('../models/FAQ');
const KnowledgeEntry = require('../models/KnowledgeEntry');
const ContactInfo = require('../models/ContactInfo');
const TransportInfo = require('../models/TransportInfo');
const LibraryInfo = require('../models/LibraryInfo');

const seedData = async () => {
  try {
    let mongod = null;
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campusatlas');
      console.log('Connected to MongoDB');
    } catch(err) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      console.log('Local MongoDB connection failed. Falling back to mongodb-memory-server...');
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`In-memory MongoDB started and connected: ${uri}`);
    }

    await Promise.all([
      User.deleteMany({}), Institution.deleteMany({}), StudentPurchase.deleteMany({}),
      Course.deleteMany({}), Department.deleteMany({}), FeeStructure.deleteMany({}),
      Scholarship.deleteMany({}), HostelInfo.deleteMany({}), PlacementRecord.deleteMany({}),
      Notice.deleteMany({}), FAQ.deleteMany({}), KnowledgeEntry.deleteMany({}),
      ContactInfo.deleteMany({}), TransportInfo.deleteMany({}), LibraryInfo.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@campusatlas.ai',
      password: 'Admin@123',
      role: 'superadmin',
    });
    console.log('Created super admin');

    const institutionsData = [
      {
        name: 'Meridian Institute of Technology',
        type: 'institute',
        location: { city: 'Pune', state: 'Maharashtra' },
        shortDescription: 'Premier engineering institute with 95% placement record and industry-aligned curriculum.',
        description: 'Meridian Institute of Technology is one of India\'s leading engineering institutions, known for its rigorous academics, industry partnerships, and state-of-the-art research facilities. Established in 2001, MIT offers undergraduate, postgraduate, and doctoral programs across all major engineering disciplines.',
        website: 'https://meridian.edu.in',
        email: 'info@meridian.edu.in',
        phone: '+91-20-4545-6789',
        established: 2001,
        accreditation: ['NAAC A++', 'NBA', 'AICTE Approved'],
        affiliatedTo: 'Savitribai Phule Pune University',
        status: 'active',
        subscriptionPlan: 'enterprise',
        subscriptionStatus: 'active',
        admissionsOpen: true,
        tags: ['engineering', 'technology', 'research', 'placements'],
      },
      {
        name: 'Oakfield University',
        type: 'university',
        location: { city: 'Bangalore', state: 'Karnataka' },
        shortDescription: 'Multidisciplinary research university offering 120+ programs across 18 schools.',
        description: 'Oakfield University is a premier multidisciplinary institution in Bangalore, offering a wide range of undergraduate, postgraduate, and doctoral programs in sciences, humanities, business, law, and technology. Founded in 1985, Oakfield is known for its vibrant campus life, diverse student body of over 25,000 students.',
        website: 'https://oakfield.edu.in',
        email: 'admissions@oakfield.edu.in',
        phone: '+91-80-2345-6789',
        established: 1985,
        accreditation: ['NAAC A+', 'UGC Recognized', 'NIRF Ranked'],
        affiliatedTo: 'Autonomous University',
        status: 'active',
        subscriptionPlan: 'growth',
        subscriptionStatus: 'active',
        admissionsOpen: true,
        tags: ['university', 'research', 'multidisciplinary', 'campus life'],
      },
      {
        name: 'Crestview Academy',
        type: 'college',
        location: { city: 'Hyderabad', state: 'Telangana' },
        shortDescription: 'Liberal arts college focused on holistic education, creativity, and leadership.',
        description: 'Crestview Academy is a distinguished liberal arts and sciences college in Hyderabad. With a focus on holistic education, Crestview offers an intimate learning environment with small class sizes, mentorship-driven academics, and a strong emphasis on developing critical thinking, creativity, and leadership capabilities in students.',
        website: 'https://crestview.edu.in',
        email: 'hello@crestview.edu.in',
        phone: '+91-40-3456-7890',
        established: 2008,
        accreditation: ['NAAC A', 'AICTE'],
        affiliatedTo: 'Osmania University',
        status: 'active',
        subscriptionPlan: 'starter',
        subscriptionStatus: 'active',
        admissionsOpen: false,
        tags: ['liberal arts', 'sciences', 'leadership', 'holistic'],
      },
    ];

    const adminData = [
      { name: 'Dr. Priya Sharma', email: 'admin@meridian.edu.in', password: 'Meridian@123' },
      { name: 'Prof. Arjun Mehta', email: 'admin@oakfield.edu.in', password: 'Oakfield@123' },
      { name: 'Ms. Neha Reddy', email: 'admin@crestview.edu.in', password: 'Crestview@123' },
    ];

    const institutions = [];
    for (let i = 0; i < institutionsData.length; i++) {
      const inst = await Institution.create(institutionsData[i]);
      const admin = await User.create({
        name: adminData[i].name,
        email: adminData[i].email,
        password: adminData[i].password,
        role: 'institutionAdmin',
        institutionId: inst._id,
      });
      inst.adminId = admin._id;
      await inst.save();
      institutions.push(inst);
      console.log(`Created institution: ${inst.name} with admin: ${admin.email}`);
    }

    const student1 = await User.create({ name: 'Rahul Verma', email: 'rahul@student.com', password: 'Student@123', role: 'student' });
    const student2 = await User.create({ name: 'Aisha Khan', email: 'aisha@student.com', password: 'Student@123', role: 'student' });

    await StudentPurchase.create({
      userId: student1._id,
      amount: 999,
      transactionId: 'TXN_DEMO_001',
      status: 'completed',
      selectedInstitutionId: institutions[0]._id,
    });
    await StudentPurchase.create({
      userId: student2._id,
      amount: 999,
      transactionId: 'TXN_DEMO_002',
      status: 'completed',
      selectedInstitutionId: institutions[1]._id,
    });
    console.log('Created demo students with purchases');

    const mit = institutions[0]._id;
    const oak = institutions[1]._id;
    const crest = institutions[2]._id;

    const deptsMIT = await Department.insertMany([
      { institutionId: mit, name: 'Computer Science & Engineering', code: 'CSE', head: 'Dr. Vikram Nair', email: 'cse@meridian.edu.in', phone: '020-4545-6790', established: 2001 },
      { institutionId: mit, name: 'Electronics & Communication', code: 'ECE', head: 'Dr. Sunita Patel', email: 'ece@meridian.edu.in', phone: '020-4545-6791', established: 2001 },
      { institutionId: mit, name: 'Mechanical Engineering', code: 'ME', head: 'Prof. Rajesh Kumar', email: 'me@meridian.edu.in', phone: '020-4545-6792', established: 2001 },
      { institutionId: mit, name: 'Civil Engineering', code: 'CE', head: 'Dr. Anita Joshi', email: 'civil@meridian.edu.in', phone: '020-4545-6793', established: 2003 },
    ]);

    const deptsOAK = await Department.insertMany([
      { institutionId: oak, name: 'School of Business', code: 'BUS', head: 'Dr. Kiran Rao', email: 'business@oakfield.edu.in', phone: '080-2345-6790', established: 1985 },
      { institutionId: oak, name: 'School of Law', code: 'LAW', head: 'Prof. Meera Singh', email: 'law@oakfield.edu.in', phone: '080-2345-6791', established: 1990 },
      { institutionId: oak, name: 'School of Sciences', code: 'SCI', head: 'Dr. Arvind Sharma', email: 'science@oakfield.edu.in', phone: '080-2345-6792', established: 1985 },
    ]);

    const deptsCREST = await Department.insertMany([
      { institutionId: crest, name: 'Humanities & Social Sciences', code: 'HSS', head: 'Dr. Pooja Nair', email: 'hss@crestview.edu.in', phone: '040-3456-7891', established: 2008 },
      { institutionId: crest, name: 'Economics & Finance', code: 'ECO', head: 'Prof. Sanjay Malik', email: 'eco@crestview.edu.in', phone: '040-3456-7892', established: 2010 },
    ]);

    await Course.insertMany([
      { institutionId: mit, name: 'B.Tech Computer Science Engineering', code: 'BTCSE', departmentId: deptsMIT[0]._id, level: 'undergraduate', duration: '4 Years', totalSeats: 120, fees: 185000, eligibility: '10+2 with PCM, min 60%; JEE score preferred', mode: 'full-time', specializations: ['AI & ML', 'Data Science', 'Cybersecurity'] },
      { institutionId: mit, name: 'B.Tech Electronics & Communication', code: 'BTECE', departmentId: deptsMIT[1]._id, level: 'undergraduate', duration: '4 Years', totalSeats: 90, fees: 175000, eligibility: '10+2 with PCM, min 60%', mode: 'full-time' },
      { institutionId: mit, name: 'M.Tech Artificial Intelligence', code: 'MTAI', departmentId: deptsMIT[0]._id, level: 'postgraduate', duration: '2 Years', totalSeats: 30, fees: 145000, eligibility: 'B.Tech/BE with min 60%; GATE score preferred', mode: 'full-time' },
      { institutionId: mit, name: 'B.Tech Mechanical Engineering', code: 'BTME', departmentId: deptsMIT[2]._id, level: 'undergraduate', duration: '4 Years', totalSeats: 90, fees: 165000, eligibility: '10+2 with PCM, min 55%', mode: 'full-time' },
      { institutionId: oak, name: 'MBA Business Administration', code: 'MBA', departmentId: deptsOAK[0]._id, level: 'postgraduate', duration: '2 Years', totalSeats: 180, fees: 250000, eligibility: 'Any graduation with min 50%; CAT/MAT/XAT', mode: 'full-time', specializations: ['Finance', 'Marketing', 'HR', 'Operations'] },
      { institutionId: oak, name: 'B.Com Honours', code: 'BCOM', departmentId: deptsOAK[0]._id, level: 'undergraduate', duration: '3 Years', totalSeats: 200, fees: 75000, eligibility: '10+2 Commerce with min 50%', mode: 'full-time' },
      { institutionId: oak, name: 'LLB Law', code: 'LLB', departmentId: deptsOAK[1]._id, level: 'undergraduate', duration: '5 Years', totalSeats: 120, fees: 95000, eligibility: '10+2 any stream, min 50%; CLAT score', mode: 'full-time' },
      { institutionId: oak, name: 'B.Sc Physics Honours', code: 'BSCPHY', departmentId: deptsOAK[2]._id, level: 'undergraduate', duration: '3 Years', totalSeats: 80, fees: 55000, eligibility: '10+2 PCM with min 60%', mode: 'full-time' },
      { institutionId: crest, name: 'BA English Literature', code: 'BAENGL', departmentId: deptsCREST[0]._id, level: 'undergraduate', duration: '3 Years', totalSeats: 60, fees: 65000, eligibility: '10+2 any stream, min 50%', mode: 'full-time' },
      { institutionId: crest, name: 'BA Economics', code: 'BAECO', departmentId: deptsCREST[1]._id, level: 'undergraduate', duration: '3 Years', totalSeats: 80, fees: 70000, eligibility: '10+2 with Mathematics, min 55%', mode: 'full-time' },
      { institutionId: crest, name: 'MA Psychology', code: 'MAPSY', departmentId: deptsCREST[0]._id, level: 'postgraduate', duration: '2 Years', totalSeats: 40, fees: 85000, eligibility: 'BA/B.Sc with min 50%', mode: 'full-time' },
    ]);

    await FeeStructure.insertMany([
      { institutionId: mit, courseName: 'B.Tech CSE', tuitionFee: 150000, registrationFee: 10000, examFee: 5000, libraryFee: 5000, sportsFee: 3000, totalFee: 185000, academicYear: '2024-25', perSemester: false },
      { institutionId: mit, courseName: 'M.Tech AI', tuitionFee: 120000, registrationFee: 8000, examFee: 5000, libraryFee: 4000, sportsFee: 2000, totalFee: 145000, academicYear: '2024-25', perSemester: false },
      { institutionId: oak, courseName: 'MBA', tuitionFee: 200000, registrationFee: 15000, examFee: 8000, libraryFee: 7000, sportsFee: 5000, totalFee: 250000, academicYear: '2024-25', perSemester: false },
      { institutionId: oak, courseName: 'B.Com Honours', tuitionFee: 60000, registrationFee: 5000, examFee: 3000, libraryFee: 3000, sportsFee: 2000, totalFee: 75000, academicYear: '2024-25', perSemester: false },
      { institutionId: crest, courseName: 'BA English Literature', tuitionFee: 50000, registrationFee: 5000, examFee: 3000, libraryFee: 3000, sportsFee: 2000, totalFee: 65000, academicYear: '2024-25', perSemester: false },
    ]);

    await Scholarship.insertMany([
      { institutionId: mit, name: 'Merit Excellence Scholarship', type: 'merit', amount: 50000, coverage: 'Partial tuition', eligibility: 'Top 10% in JEE / 90%+ in 10+2', howToApply: 'Automatically awarded on admission based on merit' },
      { institutionId: mit, name: 'SC/ST Fee Waiver', type: 'sc-st', amount: 100000, coverage: 'Up to full tuition waiver', eligibility: 'SC/ST category students with caste certificate', howToApply: 'Submit caste certificate and income proof at admission office' },
      { institutionId: mit, name: 'Sports Achievement Award', type: 'sports', amount: 30000, coverage: 'Partial tuition', eligibility: 'National/State level sports achievement', howToApply: 'Apply with sports certificate before October 15' },
      { institutionId: oak, name: 'Oakfield Merit Scholarship', type: 'merit', amount: 75000, coverage: 'Partial fee', eligibility: '85%+ in graduation for PG programs', howToApply: 'Apply online via scholarship portal' },
      { institutionId: oak, name: 'Need-Based Financial Aid', type: 'need-based', amount: 40000, coverage: 'Partial fee support', eligibility: 'Family income below ₹3 LPA', howToApply: 'Submit income proof and application form' },
      { institutionId: crest, name: 'Crestview Excellence Grant', type: 'merit', amount: 25000, coverage: 'Partial tuition', eligibility: '80%+ in 10+2 / Graduation', howToApply: 'Apply at admission office with marksheets' },
    ]);

    await HostelInfo.insertMany([
      { institutionId: mit, name: "Boys' Hostel - Aryabhatta Block", type: 'boys', totalRooms: 200, totalCapacity: 400, feePerYear: 80000, messAvailable: true, messFeePerYear: 45000, facilities: ['Wi-Fi', 'Gym', 'Laundry', 'Common Room', 'AC Rooms Available', 'CCTV', '24/7 Security'], warden: 'Mr. Suresh Gupta', contact: '020-4545-6800', address: 'Block A, Meridian Campus, Pune' },
      { institutionId: mit, name: "Girls' Hostel - Saraswati Block", type: 'girls', totalRooms: 150, totalCapacity: 300, feePerYear: 85000, messAvailable: true, messFeePerYear: 45000, facilities: ['Wi-Fi', 'Gym', 'Beauty Salon', 'Common Room', 'AC Rooms', 'CCTV', '24/7 Security', 'Lady Warden'], warden: 'Mrs. Kavita Iyer', contact: '020-4545-6801', address: 'Block B, Meridian Campus, Pune' },
      { institutionId: oak, name: 'University Residence Hall - North', type: 'boys', totalRooms: 300, totalCapacity: 600, feePerYear: 70000, messAvailable: true, messFeePerYear: 40000, facilities: ['Wi-Fi', 'Study Rooms', 'Indoor Games', 'Cafeteria', 'Gymnasium', 'Medical Facility'], warden: 'Dr. Rohit Shetty', contact: '080-2345-6800' },
      { institutionId: oak, name: 'University Residence Hall - South', type: 'girls', totalRooms: 250, totalCapacity: 500, feePerYear: 72000, messAvailable: true, messFeePerYear: 40000, facilities: ['Wi-Fi', 'Study Rooms', 'Common Room', 'Cafeteria', '24/7 Security'], warden: 'Ms. Divya Shenoy', contact: '080-2345-6801' },
      { institutionId: crest, name: 'Crestview Residence', type: 'coed', totalRooms: 120, totalCapacity: 220, feePerYear: 60000, messAvailable: true, messFeePerYear: 38000, facilities: ['Wi-Fi', 'Common Lounge', 'Study Area', 'Sports Facilities', 'CCTV'], warden: 'Dr. Kavya Nair', contact: '040-3456-7893' },
    ]);

    await PlacementRecord.insertMany([
      { institutionId: mit, year: 2024, totalStudentsPlaced: 456, totalStudentsEligible: 480, highestPackage: 45, averagePackage: 12.5, lowestPackage: 4.5, placementRate: 95, topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Wipro', 'Accenture', 'Flipkart', 'Juspay', 'Zomato'], courseWise: [{ courseName: 'CSE', placed: 118, avgPackage: 18.5 }, { courseName: 'ECE', placed: 85, avgPackage: 10.2 }, { courseName: 'ME', placed: 80, avgPackage: 7.8 }], notableAlumni: [{ name: 'Amit Joshi', company: 'Google', role: 'Senior SWE' }, { name: 'Priya Singh', company: 'Microsoft', role: 'Product Manager' }] },
      { institutionId: oak, year: 2024, totalStudentsPlaced: 820, totalStudentsEligible: 1000, highestPackage: 28, averagePackage: 8.5, lowestPackage: 3.5, placementRate: 82, topRecruiters: ['Deloitte', 'KPMG', 'EY', 'McKinsey', 'Goldman Sachs', 'ICICI Bank', 'HDFC', 'Reliance', 'Tata Group'], courseWise: [{ courseName: 'MBA', placed: 175, avgPackage: 14.2 }, { courseName: 'LLB', placed: 95, avgPackage: 6.8 }, { courseName: 'B.Com', placed: 180, avgPackage: 5.2 }] },
      { institutionId: crest, year: 2024, totalStudentsPlaced: 145, totalStudentsEligible: 200, highestPackage: 12, averagePackage: 5.2, lowestPackage: 2.8, placementRate: 72.5, topRecruiters: ['Times of India Group', 'NASSCOM', 'NGOs & Think Tanks', 'Teaching Institutions', 'Civil Services'] },
    ]);

    await Notice.insertMany([
      { institutionId: mit, title: 'Admissions Open for 2024-25 Academic Year', content: 'Applications for B.Tech and M.Tech programs are now open. Last date for application is July 31, 2024. Apply online at meridian.edu.in/apply. Merit list will be published on August 10, 2024.', category: 'admission', priority: 'high', isPinned: true },
      { institutionId: mit, title: 'End Semester Examination Schedule Released', content: 'The end semester examinations for all UG and PG programs will commence from November 20, 2024. Please download your admit card from the student portal. Hall assignments will be displayed 3 days before exams.', category: 'exam', priority: 'high', isPinned: true },
      { institutionId: mit, title: 'Annual Tech Fest - TechnoVerse 2024', content: 'Meridian Institute is proud to announce its flagship annual tech festival TechnoVerse 2024 from October 15-17. Register your teams for hackathons, robotics, coding competitions, and paper presentations.', category: 'event', priority: 'medium' },
      { institutionId: mit, title: 'Campus Recruitment Drive - TCS & Infosys', content: 'TCS and Infosys will be conducting campus placement drives on October 5-6, 2024. Eligible students (7.5+ CGPA, no backlogs) please register on the placement portal by October 1.', category: 'general', priority: 'high' },
      { institutionId: oak, title: 'MBA Admissions 2024-25 Open', content: 'Oakfield University invites applications for MBA 2024-25 across specializations. Accepting CAT, MAT, and XAT scores. Group Discussion and Personal Interview rounds will be held in February. Apply at oakfield.edu.in/mba.', category: 'admission', priority: 'high', isPinned: true },
      { institutionId: oak, title: 'Convocation Ceremony 2024 - Date Announced', content: 'The Annual Convocation Ceremony 2024 for all graduating students will be held on December 15, 2024 at the University Auditorium. Students please register for convocation before November 30.', category: 'academic', priority: 'medium' },
      { institutionId: crest, title: 'Admissions Closed for 2024-25', content: 'Crestview Academy has successfully completed admissions for the 2024-25 academic year. All shortlisted students have been notified. New academic year begins August 1, 2024.', category: 'admission', priority: 'medium', isPinned: false },
      { institutionId: crest, title: 'Literary Festival - WordCraft 2024', content: 'Crestview Academy presents WordCraft 2024 - a celebration of literature, poetry, debate, and creative arts. Open to all enrolled students. Event scheduled for September 20-21, 2024.', category: 'event', priority: 'medium' },
    ]);

    await FAQ.insertMany([
      { institutionId: mit, question: 'What is the last date to apply for B.Tech admissions?', answer: 'The last date for B.Tech applications for 2024-25 is July 31, 2024. Apply online at meridian.edu.in/apply.' },
      { institutionId: mit, question: 'What is the total fee for B.Tech CSE?', answer: 'The total annual fee for B.Tech CSE is ₹1,85,000 per year including tuition, registration, exam, library, and sports fees for 2024-25.' },
      { institutionId: mit, question: 'Is hostel facility available?', answer: 'Yes, Meridian has separate boys and girls hostel blocks with a combined capacity of 700 students. Annual hostel fee is ₹80,000-85,000. Mess facility is also available at ₹45,000/year.' },
      { institutionId: mit, question: 'What is the placement rate at Meridian?', answer: 'Meridian has an exceptional 95% placement rate. The highest package in 2024 was ₹45 LPA (Google) and the average package was ₹12.5 LPA.' },
      { institutionId: mit, question: 'Is GATE required for M.Tech admission?', answer: 'GATE score is preferred but not mandatory for M.Tech admission. Students without GATE scores will have to appear for an institute-level entrance exam.' },
      { institutionId: oak, question: 'What scores do you accept for MBA admission?', answer: 'Oakfield University accepts CAT, MAT, and XAT scores for MBA admissions. The minimum percentile required is 60 for the shortlisting process.' },
      { institutionId: oak, question: 'How many students are enrolled at Oakfield?', answer: 'Oakfield University has over 25,000 students enrolled across its 18 schools and departments.' },
      { institutionId: oak, question: 'Is the LLB program affiliated with BCI?', answer: 'Yes, Oakfield\'s LLB program is recognized by the Bar Council of India (BCI) and the degree is valid for practicing law in India.' },
      { institutionId: crest, question: 'What programs does Crestview offer?', answer: 'Crestview Academy offers undergraduate programs in BA English Literature, BA Economics, and a postgraduate MA Psychology program. We focus on liberal arts and social sciences education.' },
      { institutionId: crest, question: 'Are admissions open for 2024-25?', answer: 'Admissions for 2024-25 are now closed. The next admission cycle begins in January 2025 for the 2025-26 academic year.' },
    ]);

    await KnowledgeEntry.insertMany([
      { institutionId: mit, category: 'admissions', title: 'B.Tech Admission Process 2024-25', content: 'Meridian Institute of Technology conducts B.Tech admissions based on JEE Main scores and 10+2 merit. The admission process includes: 1) Online application at meridian.edu.in/apply, 2) Document verification, 3) Counseling session, 4) Fee payment and seat confirmation. Selection criteria: 60% weightage to JEE scores + 40% weightage to 10+2 marks. SC/ST/OBC reservations apply as per government norms.' },
      { institutionId: mit, category: 'fees', title: 'Complete Fee Structure 2024-25', content: 'B.Tech CSE: ₹1,85,000/year | B.Tech ECE: ₹1,75,000/year | B.Tech ME: ₹1,65,000/year | M.Tech AI: ₹1,45,000/year. Additional charges: Hostel ₹80,000-85,000 | Mess ₹45,000 | Transport (varies by route) ₹15,000-25,000. Late fee penalty: ₹1,000/week after due date. Fee can be paid in 2 installments per year.' },
      { institutionId: mit, category: 'placements', title: 'Placement Statistics and Process', content: 'Meridian\'s Placement Cell is one of the most active in Pune. 2024 highlights: 95% placement rate, 456 students placed, highest package ₹45 LPA (Google), average ₹12.5 LPA. Pre-placement preparation includes: aptitude training, coding bootcamps, mock interviews, resume building workshops. Over 150+ companies visit campus annually including Google, Microsoft, Amazon, Flipkart, TCS, Infosys, Wipro.' },
      { institutionId: mit, category: 'general', title: 'About Meridian Institute of Technology', content: 'Meridian Institute of Technology (MIT), Pune is a NAAC A++ accredited autonomous engineering institution established in 2001. Affiliated to Savitribai Phule Pune University. Campus spread over 35 acres with state-of-the-art laboratories, library with 1.5 lakh books, sports complex, auditorium, and wi-fi enabled campus. Known for academic excellence, industry collaborations, and exceptional campus life.' },
      { institutionId: oak, category: 'admissions', title: 'Oakfield University Admission Overview', content: 'Oakfield University offers centralized admissions for all its schools. Undergraduate admissions are based on 10+2 merit / entrance exam scores. Postgraduate admissions require relevant entrance scores (CAT/MAT/XAT for MBA, CLAT for Law, GATE for technical programs). International admissions are also accepted. Apply at oakfield.edu.in/admissions. The application fee is ₹1,500.' },
      { institutionId: oak, category: 'general', title: 'About Oakfield University', content: 'Oakfield University, Bangalore was founded in 1985 and is one of South India\'s premier multidisciplinary universities. With 18 schools, 120+ programs, and 25,000+ students from 28 states, Oakfield is known for its diverse, vibrant campus culture. NAAC A+ accredited and ranked in NIRF top 100. The 200-acre campus includes residential halls, sports complex, entrepreneurship hub, and cultural centers.' },
      { institutionId: crest, category: 'general', title: 'About Crestview Academy', content: 'Crestview Academy is a liberal arts college in Hyderabad dedicated to holistic, student-centered education. Founded in 2008, Crestview believes in small class sizes (average 25 students/class), personalized mentorship, and developing critical thinking alongside domain knowledge. NAAC A accredited, affiliated to Osmania University. Campus has a dedicated innovation lab, performing arts center, and lush green spaces for reflective learning.' },
      { institutionId: crest, category: 'courses', title: 'Programs at Crestview Academy', content: 'Undergraduate Programs: BA English Literature (3 years, ₹65,000/year), BA Economics (3 years, ₹70,000/year). Postgraduate Programs: MA Psychology (2 years, ₹85,000/year). All programs are affiliated to Osmania University. Interdisciplinary minors available in Communication Studies, Sociology, and Philosophy.' },
    ]);

    await ContactInfo.insertMany([
      { institutionId: mit, type: 'office', name: 'Admissions Office', designation: 'Admissions Help Desk', email: 'admissions@meridian.edu.in', phone: '020-4545-6785', officeLocation: 'Admin Block, Ground Floor', officeHours: 'Mon-Sat, 9:00 AM - 5:00 PM' },
      { institutionId: mit, type: 'faculty', name: 'Dr. Vikram Nair', designation: 'Head of Department', department: 'CSE', email: 'vikram.nair@meridian.edu.in', phone: '020-4545-6790', officeLocation: 'CSE Block, Room 301', officeHours: 'Mon-Fri, 10:00 AM - 4:00 PM' },
      { institutionId: mit, type: 'helpdesk', name: 'Placement Cell', designation: 'Placement Coordinator', email: 'placements@meridian.edu.in', phone: '020-4545-6795', officeLocation: 'Admin Block, 2nd Floor', officeHours: 'Mon-Fri, 9:30 AM - 5:30 PM' },
      { institutionId: oak, type: 'office', name: 'Oakfield Admissions Office', designation: 'Admissions Help', email: 'admissions@oakfield.edu.in', phone: '080-2345-6785', officeLocation: 'Main Building, Block A', officeHours: 'Mon-Sat, 9:00 AM - 6:00 PM' },
      { institutionId: oak, type: 'faculty', name: 'Dr. Kiran Rao', designation: 'Dean, School of Business', department: 'Business', email: 'kiran.rao@oakfield.edu.in', phone: '080-2345-6790', officeLocation: 'Business School, Level 3', officeHours: 'Tue-Thu, 2:00 PM - 5:00 PM' },
      { institutionId: crest, type: 'office', name: 'Crestview Admissions', designation: 'Student Services', email: 'hello@crestview.edu.in', phone: '040-3456-7890', officeLocation: 'Main Building, Room 102', officeHours: 'Mon-Fri, 9:00 AM - 5:00 PM' },
    ]);

    await TransportInfo.insertMany([
      { institutionId: mit, routeName: 'Pune Station - Meridian Campus', routeNumber: 'R1', stops: [{ name: 'Pune Station', time: '7:30 AM' }, { name: 'Shivajinagar', time: '7:45 AM' }, { name: 'Baner', time: '8:10 AM' }, { name: 'Meridian Campus', time: '8:30 AM' }], feePerYear: 18000, contact: '020-4545-6810' },
      { institutionId: mit, routeName: 'Kothrud - Meridian Campus', routeNumber: 'R2', stops: [{ name: 'Kothrud Depot', time: '7:45 AM' }, { name: 'Karve Nagar', time: '7:55 AM' }, { name: 'Meridian Campus', time: '8:30 AM' }], feePerYear: 15000, contact: '020-4545-6810' },
      { institutionId: oak, routeName: 'KR Puram - Oakfield Campus', routeNumber: 'OB1', stops: [{ name: 'KR Puram Station', time: '7:15 AM' }, { name: 'Whitefield', time: '7:40 AM' }, { name: 'Oakfield Campus', time: '8:30 AM' }], feePerYear: 20000, contact: '080-2345-6810' },
    ]);

    await LibraryInfo.insertMany([
      { institutionId: mit, name: 'Dr. APJ Kalam Central Library', totalBooks: 150000, totalJournals: 250, totalEResources: 5000, openingHours: 'Mon-Sat: 8:00 AM - 10:00 PM | Sun: 9:00 AM - 5:00 PM', location: 'Library Block, Main Campus', contact: 'library@meridian.edu.in', facilities: ['Digital Catalog', 'Study Hall (500 seats)', 'Digital Resource Center', 'Self-Checkout Kiosks', 'Journal Database Access', 'Photocopy Services'], membershipFee: 0, digitalAccess: true },
      { institutionId: oak, name: 'Oakfield University Library System', totalBooks: 350000, totalJournals: 600, totalEResources: 12000, openingHours: 'Mon-Fri: 7:30 AM - 11:00 PM | Sat-Sun: 9:00 AM - 6:00 PM', location: 'Knowledge Centre Building, Campus Center', contact: 'library@oakfield.edu.in', facilities: ['5 Floors', 'Group Study Rooms', 'Silent Zones', 'Research Lab', 'JSTOR & Elsevier Access', 'AI Research Assistant'], digitalAccess: true },
      { institutionId: crest, name: 'Crestview Learning Resource Centre', totalBooks: 45000, totalJournals: 80, totalEResources: 1500, openingHours: 'Mon-Fri: 8:00 AM - 8:00 PM | Sat: 9:00 AM - 4:00 PM', location: 'Building C, Ground Floor', contact: 'library@crestview.edu.in', facilities: ['Quiet Study Hall', 'Reading Lounge', 'E-Book Access', 'Newspaper Archive'], digitalAccess: true },
    ]);

    console.log('All seed data created successfully!');
    console.log('\n=== Login Credentials ===');
    console.log('Super Admin: admin@campusatlas.ai / Admin@123');
    console.log('MIT Admin: admin@meridian.edu.in / Meridian@123');
    console.log('Oakfield Admin: admin@oakfield.edu.in / Oakfield@123');
    console.log('Crestview Admin: admin@crestview.edu.in / Crestview@123');
    console.log('Student 1: rahul@student.com / Student@123 (has purchase)');
    console.log('Student 2: aisha@student.com / Student@123 (has purchase)');
    console.log('========================\n');

    if (require.main === module) {
      await mongoose.disconnect();
      process.exit(0);
    }
  } catch (err) {
    console.error('Seed error:', err);
    if (require.main === module) {
      await mongoose.disconnect();
      process.exit(1);
    }
    throw err;
  } // end of catch block
}; // end of seedData

// Run directly if called from command line
if (require.main === module) {
  seedData();
}

module.exports = { seedData };
