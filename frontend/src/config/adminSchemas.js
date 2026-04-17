import { 
  BookOpen, Users, DollarSign, GraduationCap, 
  Home, BarChart2, Bell, Phone, Truck, 
  Library, HelpCircle, Brain, Building2 
} from 'lucide-react'

export const adminSchemas = {
  courses: {
    title: 'Courses & Programs',
    icon: BookOpen,
    apiPath: '/admin/courses',
    fields: [
      { name: 'name', label: 'Course Name', type: 'text', required: true },
      { name: 'code', label: 'Course Code', type: 'text' },
      { name: 'level', label: 'Level', type: 'select', options: ['undergraduate', 'postgraduate', 'diploma', 'certificate', 'phd', 'school'], required: true },
      { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 4 Years' },
      { name: 'fees', label: 'Annual Fees (₹)', type: 'number' },
      { name: 'totalSeats', label: 'Total Seats', type: 'number' },
      { name: 'mode', label: 'Mode', type: 'select', options: ['full-time', 'part-time', 'online', 'distance'] },
      { name: 'eligibility', label: 'Eligibility Criteria', type: 'textarea' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    columns: [
      { header: 'Name', key: 'name' },
      { header: 'Level', key: 'level' },
      { header: 'Duration', key: 'duration' },
      { header: 'Fees', key: 'fees', type: 'currency' },
    ]
  },
  departments: {
    title: 'Departments',
    icon: Users,
    apiPath: '/admin/departments',
    fields: [
      { name: 'name', label: 'Department Name', type: 'text', required: true },
      { name: 'head', label: 'Head of Department', type: 'text' },
      { name: 'email', label: 'Contact Email', type: 'email' },
      { name: 'phone', label: 'Phone Number', type: 'text' },
      { name: 'description', label: 'About Department', type: 'textarea' },
    ],
    columns: [
      { header: 'Name', key: 'name' },
      { header: 'HOD', key: 'head' },
      { header: 'Email', key: 'email' },
    ]
  },
  fees: {
    title: 'Fee Structure',
    icon: DollarSign,
    apiPath: '/admin/fees',
    fields: [
      { name: 'courseName', label: 'Course / Category Name', type: 'text', required: true },
      { name: 'tuitionFee', label: 'Tuition Fee (₹)', type: 'number' },
      { name: 'otherFees', label: 'Other Fees (₹)', type: 'number' },
      { name: 'totalFee', label: 'Total Annual Fee (₹)', type: 'number', required: true },
      { name: 'academicYear', label: 'Academic Year', type: 'text', placeholder: 'e.g. 2024-25' },
      { name: 'notes', label: 'Additional Notes', type: 'textarea' },
    ],
    columns: [
      { header: 'Course/Item', key: 'courseName' },
      { header: 'Total Fee', key: 'totalFee', type: 'currency' },
      { header: 'Year', key: 'academicYear' },
    ]
  },
  notices: {
    title: 'Campus Notices',
    icon: Bell,
    apiPath: '/admin/notices',
    fields: [
      { name: 'title', label: 'Notice Title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['academic', 'admission', 'event', 'exam', 'holiday', 'general'], required: true },
      { name: 'content', label: 'Notice Content', type: 'textarea', required: true },
      { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
      { name: 'isUrgent', label: 'Mark as Urgent', type: 'checkbox' },
    ],
    columns: [
      { header: 'Title', key: 'title' },
      { header: 'Category', key: 'category' },
      { header: 'Date', key: 'createdAt', type: 'date' },
    ]
  },
  faqs: {
    title: 'Frequently Asked Questions',
    icon: HelpCircle,
    apiPath: '/admin/faqs',
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true },
      { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Admission, Hostel' },
    ],
    columns: [
      { header: 'Question', key: 'question' },
      { header: 'Category', key: 'category' },
    ]
  },
  knowledge: {
    title: 'AI Knowledge Base',
    icon: Brain,
    apiPath: '/admin/knowledge',
    fields: [
      { name: 'category', label: 'Module Category', type: 'text', required: true, placeholder: 'e.g. Placement Stats, Campus Culture' },
      { name: 'title', label: 'Topic Title', type: 'text', required: true },
      { name: 'content', label: 'Detailed Knowledge (Raw Text)', type: 'textarea', required: true, rows: 10 },
    ],
    columns: [
      { header: 'Topic', key: 'title' },
      { header: 'Category', key: 'category' },
    ]
  },
  hostel: {
    title: 'Hostel & Mess',
    icon: Home,
    apiPath: '/admin/hostel',
    fields: [
      { name: 'name', label: 'Hostel Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['boys', 'girls', 'co-ed'] },
      { name: 'feePerYear', label: 'Annual Fee (₹)', type: 'number' },
      { name: 'messAvailable', label: 'Mess Available', type: 'checkbox' },
      { name: 'messFeePerYear', label: 'Mess Fee (₹)', type: 'number' },
      { name: 'description', label: 'Facilities/Rules', type: 'textarea' },
    ],
    columns: [
      { header: 'Hostel', key: 'name' },
      { header: 'Type', key: 'type' },
      { header: 'Fee', key: 'feePerYear', type: 'currency' },
    ]
  },
  placements: {
    title: 'Placement Records',
    icon: BarChart2,
    apiPath: '/admin/placements',
    fields: [
      { name: 'year', label: 'Year', type: 'number', required: true },
      { name: 'highestPackage', label: 'Highest Package (LPA)', type: 'number' },
      { name: 'averagePackage', label: 'Average Package (LPA)', type: 'number' },
      { name: 'placementRate', label: 'Placement Percentage (%)', type: 'number' },
      { name: 'totalStudentsPlaced', label: 'Students Placed', type: 'number' },
    ],
    columns: [
      { header: 'Year', key: 'year' },
      { header: 'Highest', key: 'highestPackage' },
      { header: 'Avg', key: 'averagePackage' },
      { header: 'Rate (%)', key: 'placementRate' },
    ]
  },
  scholarships: {
    title: 'Scholarships',
    icon: GraduationCap,
    apiPath: '/admin/scholarships',
    fields: [
      { name: 'name', label: 'Scholarship Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'text', placeholder: 'e.g. Merit-based, Need-based' },
      { name: 'amount', label: 'Amount (₹)', type: 'number' },
      { name: 'eligibility', label: 'Eligibility', type: 'textarea' },
      { name: 'howToApply', label: 'Application Process', type: 'textarea' },
    ],
    columns: [
      { header: 'Name', key: 'name' },
      { header: 'Amount', key: 'amount', type: 'currency' },
    ]
  },
  contacts: {
    title: 'Emergency & Key Contacts',
    icon: Phone,
    apiPath: '/admin/contacts',
    fields: [
      { name: 'name', label: 'Person / Office Name', type: 'text', required: true },
      { name: 'designation', label: 'Designation', type: 'text' },
      { name: 'department', label: 'Department', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'text', required: true },
      { name: 'officeLocation', label: 'Office Location', type: 'text' },
    ],
    columns: [
      { header: 'Name', key: 'name' },
      { header: 'Phone', key: 'phone' },
      { header: 'Dept', key: 'department' },
    ]
  },
  transport: {
    title: 'Transport Routes',
    icon: Truck,
    apiPath: '/admin/transport',
    fields: [
      { name: 'routeName', label: 'Route Name', type: 'text', required: true },
      { name: 'stops', label: 'Main Stops (Comma separated)', type: 'text' },
      { name: 'feePerYear', label: 'Annual Transport Fee (₹)', type: 'number' },
      { name: 'contact', label: 'Travel Incharge Contact', type: 'text' },
    ],
    columns: [
      { header: 'Route', key: 'routeName' },
      { header: 'Fee', key: 'feePerYear', type: 'currency' },
    ]
  },
  library: {
    title: 'Library Information',
    icon: Library,
    apiPath: '/admin/library',
    fields: [
      { name: 'totalBooks', label: 'Total Books', type: 'number' },
      { name: 'totalJournals', label: 'Online/Print Journals', type: 'number' },
      { name: 'openingHours', label: 'Opening Hours', type: 'text' },
      { name: 'location', label: 'Library Location', type: 'text' },
      { name: 'rules', label: 'Library Rules', type: 'textarea' },
    ],
    columns: [
      { header: 'Total Books', key: 'totalBooks' },
      { header: 'Location', key: 'location' },
    ]
  }
}
