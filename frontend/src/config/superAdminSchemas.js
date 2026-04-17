import { 
  Building2, Users, GraduationCap, DollarSign, Activity 
} from 'lucide-react'

export const superAdminSchemas = {
  institutions: {
    title: 'Institutions',
    icon: Building2,
    apiPath: '/superadmin/institutions',
    fields: [
      { name: 'name', label: 'Institution Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['university', 'college', 'institute', 'school'], required: true },
      { name: 'email', label: 'Official Email', type: 'email', required: true },
      { name: 'phone', label: 'Official Phone', type: 'text' },
      { name: 'website', label: 'Website', type: 'text' },
      { name: 'location.city', label: 'City', type: 'text' },
      { name: 'location.state', label: 'State', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: ['pending', 'active', 'inactive', 'suspended'], required: true },
      { name: 'shortDescription', label: 'Short Description', type: 'textarea' },
      { name: 'adminName', label: 'Admin Full Name (For account creation)', type: 'text', required: true },
      { name: 'adminEmail', label: 'Admin Email (For login)', type: 'email', required: true },
      { name: 'adminPassword', label: 'Admin Temporary Password', type: 'text', placeholder: 'Defaults to campus@123' },
    ],
    columns: [
      { header: 'Name', key: 'name' },
      { header: 'Type', key: 'type' },
      { header: 'Status', key: 'status' },
      { header: 'Created', key: 'createdAt', type: 'date' },
    ]
  },
  students: {
    title: 'Platform Students',
    icon: GraduationCap,
    apiPath: '/superadmin/students',
    fields: [
      { name: 'name', label: 'Student Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'text' },
    ],
    columns: [
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Joined', key: 'createdAt', type: 'date' },
    ]
  },
  purchases: {
    title: 'Revenue & Purchases',
    icon: DollarSign,
    apiPath: '/superadmin/student-purchases',
    fields: [
      { name: 'status', label: 'Payment Status', type: 'select', options: ['pending', 'completed', 'failed'] },
    ],
    columns: [
      { header: 'Purchase ID', key: '_id' },
      { header: 'Amount', key: 'amount', type: 'currency' },
      { header: 'Status', key: 'status' },
      { header: 'Date', key: 'purchasedAt', type: 'date' },
    ]
  },
  users: {
    title: 'Global Users',
    icon: Users,
    apiPath: '/superadmin/users',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email Address', type: 'email', required: true },
      { name: 'role', label: 'User Role', type: 'select', options: ['superadmin', 'institutionAdmin', 'student'], required: true },
    ],
    columns: [
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Role', key: 'role' },
    ]
  }
}
