import api from "./api";

export const appointmentService = {
  // Get all appointments
  getAppointments: (params = {}) => {
    return api.get("/appointments/", { params });
  },

  // Get single appointment
  getAppointment: (id) => {
    return api.get(`/appointments/${id}/`);
  },

  // Create appointment
  createAppointment: (data) => {
    return api.post("/appointments/", data);
  },

  // Update appointment
  updateAppointment: (id, data) => {
    return api.put(`/appointments/${id}/`, data);
  },

  // Delete appointment
  deleteAppointment: (id) => {
    return api.delete(`/appointments/${id}/`);
  },

  // Get today's appointments
  getTodayAppointments: () => {
    return api.get("/appointments/today/");
  },

  // Get upcoming appointments
  getUpcomingAppointments: () => {
    return api.get("/appointments/upcoming/");
  },

  // Confirm appointment
  confirmAppointment: (id) => {
    return api.post(`/appointments/${id}/confirm/`);
  },

  // Cancel appointment
  cancelAppointment: (id) => {
    return api.post(`/appointments/${id}/cancel/`);
  },
};
