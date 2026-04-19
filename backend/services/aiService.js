const Groq = require('groq-sdk');
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

let groqClient = null;

const getGroqClient = () => {
  const key = process.env.GROQ_API_KEY;
  if (!key || !key.trim()) return null;

  if (!groqClient) {
    try {
      groqClient = new Groq({ apiKey: key.trim() });
    } catch (error) {
      console.error('Failed to initialize Groq client:', error?.message || error);
      return null;
    }
  }

  return groqClient;
};

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
    knowledge.forEach(k => {
      const category = (k.category || 'general').toString().toUpperCase();
      context += `### ${category} - ${k.title || 'Untitled'}\n${k.content || ''}\n\n`;
    });
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
      const category = (n.category || 'general').toString().toUpperCase();
      const title = n.title || 'Notice';
      const content = (n.content || '').toString();
      context += `- **[${category}]** ${title}: ${content.substring(0, 200)}\n`;
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
  const groq = getGroqClient();
  if (!groq) {
    return 'AI service is not configured right now. Please try again in a moment or contact support.';
  }

  const trimmedContext = (institutionContext || '').slice(0, 30000);

  const systemPrompt = `You are an intelligent AI assistant for ${institutionName}. 
You ONLY answer questions based on the institution data provided to you. 
You do NOT have knowledge of any other institution.
If a student asks about another institution, politely say you can only answer about ${institutionName}.
If information is not available in the provided data, clearly say "This information is not currently available. Please contact the institution directly."
Handle Hinglish queries and spelling mistakes gracefully.
Give structured, readable answers. Use bullet points and tables where appropriate.
Be helpful, professional, and concise.

INSTITUTION DATA:
${trimmedContext}

IMPORTANT RULES:
- Never make up information not in the data above
- Always scope your answers to ${institutionName} only
- Be warm and helpful in tone
- If asked about fees, always mention the rupee amounts available in the data`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: 'user', content: userMessage }
  ];

  const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

  for (const model of models) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      });

      const text = chatCompletion.choices[0]?.message?.content;
      if (text && text.trim()) return text;
    } catch (error) {
      const status = error?.status || error?.code;
      const detail = error?.error?.message || error?.message || 'Unknown Groq error';
      console.error(`Groq API Error (${model}):`, status, detail);

      if (status === 401 || status === 403) {
        return 'AI service authentication failed. Please verify Groq API configuration and try again.';
      }
      if (status === 429) {
        return 'AI service is currently busy due to high traffic. Please retry in a few seconds.';
      }
    }
  }

  return 'I am temporarily unable to generate a response right now. Please try your message again.';
};

module.exports = { fetchInstitutionContext, generateChatResponse };
const Groq = require('groq-sdk');
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

<<<<<<< HEAD
let groqClient = null;

const getGroqClient = () => {
  const key = process.env.GROQ_API_KEY;
  if (!key || !key.trim()) return null;

  if (!groqClient) {
    try {
      groqClient = new Groq({ apiKey: key.trim() });
    } catch (error) {
      console.error('Failed to initialize Groq client:', error?.message || error);
      return null;
    }
  }

  return groqClient;
};
=======
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
>>>>>>> origin/main

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
<<<<<<< HEAD
    knowledge.forEach(k => {
      const category = (k.category || 'general').toString().toUpperCase();
      context += `### ${category} - ${k.title || 'Untitled'}\n${k.content || ''}\n\n`;
    });
=======
    knowledge.forEach(k => { context += `### ${k.category.toUpperCase()} - ${k.title}\n${k.content}\n\n`; });
>>>>>>> origin/main
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
<<<<<<< HEAD
      const category = (n.category || 'general').toString().toUpperCase();
      const title = n.title || 'Notice';
      const content = (n.content || '').toString();
      context += `- **[${category}]** ${title}: ${content.substring(0, 200)}\n`;
=======
      context += `- **[${n.category.toUpperCase()}]** ${n.title}: ${n.content.substring(0, 200)}\n`;
>>>>>>> origin/main
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
<<<<<<< HEAD
  const groq = getGroqClient();
  if (!groq) {
    return 'AI service is not configured right now. Please try again in a moment or contact support.';
  }

  const trimmedContext = (institutionContext || '').slice(0, 30000);

=======
>>>>>>> origin/main
  const systemPrompt = `You are an intelligent AI assistant for ${institutionName}. 
You ONLY answer questions based on the institution data provided to you. 
You do NOT have knowledge of any other institution.
If a student asks about another institution, politely say you can only answer about ${institutionName}.
If information is not available in the provided data, clearly say "This information is not currently available. Please contact the institution directly."
Handle Hinglish queries and spelling mistakes gracefully.
Give structured, readable answers. Use bullet points and tables where appropriate.
Be helpful, professional, and concise.

INSTITUTION DATA:
<<<<<<< HEAD
${trimmedContext}
=======
${institutionContext}
>>>>>>> origin/main

IMPORTANT RULES:
- Never make up information not in the data above
- Always scope your answers to ${institutionName} only
- Be warm and helpful in tone
- If asked about fees, always mention the rupee amounts available in the data`;

  // Format history for Groq (OpenAI format)
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(msg => ({
      role: msg.role, // 'user' or 'assistant'
      content: msg.content
    })),
    { role: 'user', content: userMessage }
  ];

<<<<<<< HEAD
  const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

  for (const model of models) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      });

      const text = chatCompletion.choices[0]?.message?.content;
      if (text && text.trim()) return text;
    } catch (error) {
      const status = error?.status || error?.code;
      const detail = error?.error?.message || error?.message || 'Unknown Groq error';
      console.error(`Groq API Error (${model}):`, status, detail);

      if (status === 401 || status === 403) {
        return 'AI service authentication failed. Please verify Groq API configuration and try again.';
      }
      if (status === 429) {
        return 'AI service is currently busy due to high traffic. Please retry in a few seconds.';
      }
    }
  }

  return 'I am temporarily unable to generate a response right now. Please try your message again.';
=======
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    return chatCompletion.choices[0]?.message?.content || "I apologize, but I could not generate a response. Please try again.";
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error("Failed to generate response from AI provider.");
  }
>>>>>>> origin/main
};

module.exports = { fetchInstitutionContext, generateChatResponse };
