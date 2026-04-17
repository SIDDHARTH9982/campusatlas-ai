const { GoogleGenerativeAI } = require('@google/generative-ai');
const KnowledgeEntry = require('../models/KnowledgeEntry');
const FAQ = require('../models/FAQ');
const Course = require('../models/Course');
const FeeStructure = require('../models/FeeStructure');
const Notice = require('../models/Notice');
const PlacementRecord = require('../models/PlacementRecord');
const HostelInfo = require('../models/HostelInfo');
const Scholarship = require('../models/Scholarship');
const ContactInfo = require('../models/ContactInfo');
const TransportInfo = require('../models/TransportInfo');
const LibraryInfo = require('../models/LibraryInfo');
const Department = require('../models/Department');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const fetchInstitutionContext = async (institutionId, query) => {
  const [
    knowledge, faqs, courses, fees, notices, placements,
    hostels, scholarships, contacts, transport, library, departments,
  ] = await Promise.all([
    KnowledgeEntry.find({ institutionId, isActive: true }).select('category title content').limit(30),
    FAQ.find({ institutionId, isActive: true }).select('question answer category').limit(20),
    Course.find({ institutionId, isActive: true }).select('name level duration fees eligibility description specializations').limit(20),
    FeeStructure.find({ institutionId, isActive: true }).select('courseName tuitionFee totalFee academicYear notes').limit(15),
    Notice.find({ institutionId, isActive: true }).sort({ publishedAt: -1 }).select('title content category publishedAt').limit(10),
    PlacementRecord.findOne({ institutionId }).sort({ year: -1 }),
    HostelInfo.find({ institutionId, isActive: true }).select('name type feePerYear facilities messAvailable messFeePerYear').limit(5),
    Scholarship.find({ institutionId, isActive: true }).select('name type amount eligibility howToApply').limit(10),
    ContactInfo.find({ institutionId, isActive: true }).select('name designation department email phone officeLocation officeHours').limit(15),
    TransportInfo.find({ institutionId, isActive: true }).select('routeName stops feePerYear contact').limit(10),
    LibraryInfo.findOne({ institutionId, isActive: true }),
    Department.find({ institutionId, isActive: true }).select('name head email phone').limit(15),
  ]);

  let context = '';

  if (knowledge.length > 0) {
    context += '\n## Institution Knowledge Base\n';
    knowledge.forEach(k => { context += `### ${k.category.toUpperCase()} - ${k.title}\n${k.content}\n\n`; });
  }
  if (courses.length > 0) {
    context += '\n## Courses Offered\n';
    courses.forEach(c => {
      context += `- **${c.name}** (${c.level}) | Duration: ${c.duration || 'N/A'} | Fee: ₹${c.fees?.toLocaleString() || 'N/A'}\n`;
      if (c.eligibility) context += `  Eligibility: ${c.eligibility}\n`;
    });
  }
  if (fees.length > 0) {
    context += '\n## Fee Structure\n';
    fees.forEach(f => {
      context += `- ${f.courseName}: Total Fee ₹${f.totalFee?.toLocaleString()} (${f.academicYear || 'Current Year'})\n`;
    });
  }
  if (notices.length > 0) {
    context += '\n## Recent Notices\n';
    notices.forEach(n => {
      context += `- **[${n.category.toUpperCase()}]** ${n.title}: ${n.content.substring(0, 200)}\n`;
    });
  }
  if (placements) {
    context += `\n## Placement Records (${placements.year})\n`;
    context += `- Placement Rate: ${placements.placementRate}%\n`;
    context += `- Highest Package: ₹${placements.highestPackage?.toLocaleString()} LPA\n`;
    context += `- Average Package: ₹${placements.averagePackage?.toLocaleString()} LPA\n`;
    if (placements.topRecruiters?.length) context += `- Top Recruiters: ${placements.topRecruiters.join(', ')}\n`;
  }
  if (hostels.length > 0) {
    context += '\n## Hostel Information\n';
    hostels.forEach(h => {
      context += `- **${h.name}** (${h.type}): Fee ₹${h.feePerYear?.toLocaleString()}/year | Mess: ${h.messAvailable ? 'Yes' : 'No'}\n`;
      if (h.facilities?.length) context += `  Facilities: ${h.facilities.join(', ')}\n`;
    });
  }
  if (scholarships.length > 0) {
    context += '\n## Scholarships\n';
    scholarships.forEach(s => {
      context += `- **${s.name}** (${s.type}): Amount ₹${s.amount?.toLocaleString()} | Eligibility: ${s.eligibility}\n`;
    });
  }
  if (contacts.length > 0) {
    context += '\n## Key Contacts\n';
    contacts.forEach(c => {
      context += `- ${c.name} (${c.designation || c.department}): ${c.email || ''} | ${c.phone || ''}\n`;
    });
  }
  if (transport.length > 0) {
    context += '\n## Transport Routes\n';
    transport.forEach(t => {
      context += `- Route ${t.routeName}: Fee ₹${t.feePerYear?.toLocaleString()}/year\n`;
    });
  }
  if (library) {
    context += '\n## Library\n';
    context += `- Total Books: ${library.totalBooks?.toLocaleString()} | Journals: ${library.totalJournals}\n`;
    context += `- Hours: ${library.openingHours} | Location: ${library.location}\n`;
  }
  if (departments.length > 0) {
    context += '\n## Departments\n';
    departments.forEach(d => { context += `- ${d.name} (Head: ${d.head || 'N/A'}) | ${d.email || ''}\n`; });
  }
  if (faqs.length > 0) {
    context += '\n## Frequently Asked Questions\n';
    faqs.forEach(f => { context += `Q: ${f.question}\nA: ${f.answer}\n\n`; });
  }

  return context;
};

const generateChatResponse = async (institutionName, institutionContext, conversationHistory, userMessage) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const systemPrompt = `You are an intelligent AI assistant for ${institutionName}. 
You ONLY answer questions based on the institution data provided to you. 
You do NOT have knowledge of any other institution.
If a student asks about another institution, politely say you can only answer about ${institutionName}.
If information is not available in the provided data, clearly say "This information is not currently available. Please contact the institution directly."
Handle Hinglish queries and spelling mistakes gracefully.
Give structured, readable answers. Use bullet points and tables where appropriate.
Be helpful, professional, and concise.

INSTITUTION DATA:
${institutionContext}

IMPORTANT RULES:
- Never make up information not in the data above
- Always scope your answers to ${institutionName} only
- Be warm and helpful in tone
- If asked about fees, always mention the rupee amounts available in the data`;

  const history = conversationHistory.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: `Understood! I'm the AI assistant for ${institutionName}. I'll only answer based on the institution data provided. How can I help you?` }] },
      ...history,
    ],
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
};

module.exports = { fetchInstitutionContext, generateChatResponse };
