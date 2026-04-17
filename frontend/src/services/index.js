import api from './api'

export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
}

export const institutionService = {
  getActive: (params) => api.get('/institutions/active', { params }),
  getById: (id) => api.get(`/institutions/${id}`),
}

export const studentService = {
  purchaseAccess: (data) => api.post('/student/purchase-access', data),
  getAccessStatus: () => api.get('/student/access-status'),
  selectInstitution: (institutionId) => api.post('/student/select-institution', { institutionId }),
  getDashboard: () => api.get('/student/dashboard'),
  getNotices: () => api.get('/student/notices'),
}

export const chatService = {
  sendMessage: (data) => api.post('/chat/message', data),
  getSessions: (params) => api.get('/chat/sessions', { params }),
  getSession: (id) => api.get(`/chat/session/${id}`),
  createSession: (data) => api.post('/chat/session', data),
  deleteSession: (id) => api.delete(`/chat/session/${id}`),
}

export const adminService = {
  getOverview: () => api.get('/admin/institution/overview'),
  getProfile: () => api.get('/admin/institution/profile'),
  updateProfile: (data) => api.put('/admin/institution/profile', data),

  getCourses: () => api.get('/admin/courses'),
  createCourse: (data) => api.post('/admin/courses', data),
  updateCourse: (id, data) => api.put(`/admin/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`),

  getDepts: () => api.get('/admin/departments'),
  createDept: (data) => api.post('/admin/departments', data),
  updateDept: (id, data) => api.put(`/admin/departments/${id}`, data),
  deleteDept: (id) => api.delete(`/admin/departments/${id}`),

  getFees: () => api.get('/admin/fees'),
  createFee: (data) => api.post('/admin/fees', data),
  updateFee: (id, data) => api.put(`/admin/fees/${id}`, data),
  deleteFee: (id) => api.delete(`/admin/fees/${id}`),

  getScholarships: () => api.get('/admin/scholarships'),
  createScholarship: (data) => api.post('/admin/scholarships', data),
  updateScholarship: (id, data) => api.put(`/admin/scholarships/${id}`, data),
  deleteScholarship: (id) => api.delete(`/admin/scholarships/${id}`),

  getHostel: () => api.get('/admin/hostel'),
  createHostel: (data) => api.post('/admin/hostel', data),
  updateHostel: (id, data) => api.put(`/admin/hostel/${id}`, data),
  deleteHostel: (id) => api.delete(`/admin/hostel/${id}`),

  getPlacements: () => api.get('/admin/placements'),
  createPlacement: (data) => api.post('/admin/placements', data),
  updatePlacement: (id, data) => api.put(`/admin/placements/${id}`, data),
  deletePlacement: (id) => api.delete(`/admin/placements/${id}`),

  getNotices: () => api.get('/admin/notices'),
  createNotice: (data) => api.post('/admin/notices', data),
  updateNotice: (id, data) => api.put(`/admin/notices/${id}`, data),
  deleteNotice: (id) => api.delete(`/admin/notices/${id}`),

  getFaqs: () => api.get('/admin/faqs'),
  createFaq: (data) => api.post('/admin/faqs', data),
  updateFaq: (id, data) => api.put(`/admin/faqs/${id}`, data),
  deleteFaq: (id) => api.delete(`/admin/faqs/${id}`),

  getKnowledge: () => api.get('/admin/knowledge'),
  createKnowledge: (data) => api.post('/admin/knowledge', data),
  updateKnowledge: (id, data) => api.put(`/admin/knowledge/${id}`, data),
  deleteKnowledge: (id) => api.delete(`/admin/knowledge/${id}`),

  getContacts: () => api.get('/admin/contacts'),
  createContact: (data) => api.post('/admin/contacts', data),
  updateContact: (id, data) => api.put(`/admin/contacts/${id}`, data),
  deleteContact: (id) => api.delete(`/admin/contacts/${id}`),

  getTransport: () => api.get('/admin/transport'),
  createTransport: (data) => api.post('/admin/transport', data),
  updateTransport: (id, data) => api.put(`/admin/transport/${id}`, data),
  deleteTransport: (id) => api.delete(`/admin/transport/${id}`),

  getLibrary: () => api.get('/admin/library'),
  createLibrary: (data) => api.post('/admin/library', data),
  updateLibrary: (id, data) => api.put(`/admin/library/${id}`, data),
  deleteLibrary: (id) => api.delete(`/admin/library/${id}`),
}

export const superAdminService = {
  getInstitutions: (params) => api.get('/superadmin/institutions', { params }),
  createInstitution: (data) => api.post('/superadmin/institutions', data),
  updateInstitution: (id, data) => api.put(`/superadmin/institutions/${id}`, data),
  updateStatus: (id, status) => api.put(`/superadmin/institutions/${id}/status`, { status }),
  getAnalytics: () => api.get('/superadmin/analytics'),
  getStudents: () => api.get('/superadmin/students'),
  getStudentPurchases: () => api.get('/superadmin/student-purchases'),
  getUsers: () => api.get('/superadmin/users'),
  updateUser: (id, data) => api.put(`/superadmin/users/${id}`, data),
}
