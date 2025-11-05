import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentService } from "../../services/appointmentService";
import { patientService } from "../../services/patientService";
import { useAuth } from "../../contexts/AuthContext";
import { Save, ArrowLeft, Search } from "lucide-react";
import api from "../../services/api";

const AppointmentForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    patient: "",
    doctor: user?.id || "",
    appointment_date: "",
    appointment_time: "",
    duration: 30,
    appointment_type: "consultation",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/auth/doctors/");
      const doctorsList = response.data.map((doctor) => ({
        id: doctor.id,
        name: `Dr. ${doctor.last_name || doctor.first_name || doctor.username}`,
        ...doctor,
      }));
      setDoctors(doctorsList);

      // If no doctor is selected and current user is a doctor, set it as default
      if (!formData.doctor && user?.role === "doctor") {
        setFormData((prev) => ({ ...prev, doctor: user.id }));
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      // Fallback to current user if they're a doctor
      if (user?.role === "doctor") {
        setDoctors([
          {
            id: user.id,
            name: `Dr. ${user.last_name || user.username}`,
          },
        ]);
        setFormData((prev) => ({ ...prev, doctor: user.id }));
      }
    }
  };


  const fetchPatients = async () => {
    try {
      const response = await patientService.getPatients({
        search: searchQuery,
      });
      setPatients(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        fetchPatients();
      } else {
        fetchPatients(); // Fetch all if no search query
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await appointmentService.createAppointment(formData);
      alert("Appointment scheduled successfully!");
      navigate("/dashboard/doctor/appointments");
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to schedule appointment. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots (9 AM to 5 PM, 30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/dashboard/doctor/appointments")}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-400" />
        </button>
        <h2 className="text-3xl font-bold text-white">Schedule Appointment</h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6"
      >
        {/* Patient Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Patient *
          </label>
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patient by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              name="patient"
              required
              value={formData.patient}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.patient_id} - {patient.full_name} ({patient.age}{" "}
                  years)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctor Selection - Now using the doctors state */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Doctor *
          </label>
          <select
            name="doctor"
            required
            value={formData.doctor}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name || `Dr. ${doctor.last_name || doctor.username}`}
              </option>
            ))}
          </select>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Appointment Date *
            </label>
            <input
              type="date"
              name="appointment_date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={formData.appointment_date}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time *
            </label>
            <select
              name="appointment_time"
              required
              value={formData.appointment_time}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration (minutes) *
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Appointment Type *
            </label>
            <select
              name="appointment_type"
              value={formData.appointment_type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="consultation">Consultation</option>
              <option value="follow_up">Follow-up</option>
              <option value="check_up">Check-up</option>
              <option value="emergency">Emergency</option>
              <option value="vaccination">Vaccination</option>
              <option value="lab_test">Lab Test</option>
            </select>
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Reason for Visit *
          </label>
          <textarea
            name="reason"
            required
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            placeholder="Describe the reason for this appointment..."
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
            placeholder="Any additional notes or special instructions..."
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/doctor/appointments")}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Save className="h-5 w-5" />
            <span>{loading ? "Scheduling..." : "Schedule Appointment"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
