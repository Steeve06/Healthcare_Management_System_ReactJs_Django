import api from "./api";

export const patientService = {
  // Get all patients
  getPatients: (params = {}) => {
    return api.get("/patients/", { params });
  },

  // Get single patient
  getPatient: (id) => {
    return api.get(`/patients/${id}/`);
  },

  // Create patient
  createPatient: (data) => {
    return api.post("/patients/", data);
  },

  // Update patient
  updatePatient: (id, data) => {
    return api.put(`/patients/${id}/`, data);
  },

  // Delete patient
  deletePatient: (id) => {
    return api.delete(`/patients/${id}/`);
  },

  // Get patient's medical records
  getPatientRecords: (patientId) => {
    return api.get(`/patients/${patientId}/medical_records/`);
  },

  // Get patient's appointments
  getPatientAppointments: (patientId) => {
    return api.get(`/patients/${patientId}/appointments/`);
  },

  // Search patients
  searchPatients: (query) => {
    return api.get("/patients/", { params: { search: query } });
  },
};
