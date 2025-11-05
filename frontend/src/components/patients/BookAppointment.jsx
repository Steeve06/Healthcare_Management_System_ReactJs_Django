import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ArrowLeft, Calendar, Clock, Save, User } from "lucide-react";
import api from "../../services/api";

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patientProfile, setPatientProfile] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    appointment_date: "",
    appointment_time: "",
    appointment_type: "consultation",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get patient profile
      const profileResponse = await api.get("/patients/", {
        params: { user: user.id },
      });
      const patientData =
        profileResponse.data.results?.[0] || profileResponse.data[0];
      setPatientProfile(patientData);

      // Fetch available doctors
      const doctorsResponse = await api.get("/auth/doctors/");
      setDoctors(doctorsResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientProfile) {
      alert("Patient profile not found. Please contact administration.");
      return;
    }

    setLoading(true);

    try {
      const appointmentData = {
        patient: patientProfile.id,
        doctor: formData.doctor,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        appointment_type: formData.appointment_type,
        reason: formData.reason,
        notes: formData.notes,
        duration: 30, // Default 30 minutes
      };

      await api.post("/appointments/", appointmentData);
      alert(
        "Appointment request submitted successfully! You will be notified once confirmed."
      );
      navigate("/dashboard/patient/appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  if (!patientProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/dashboard/patient/appointments")}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-400" />
        </button>
        <h2 className="text-3xl font-bold text-white">Book Appointment</h2>
      </div>

      {/* Patient Info Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
            {patientProfile.first_name?.[0]}
            {patientProfile.last_name?.[0]}
          </div>
          <div>
            <p className="text-white font-semibold">
              {patientProfile.full_name}
            </p>
            <p className="text-gray-400 text-sm">
              Patient ID: {patientProfile.patient_id}
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6"
      >
        {/* Doctor Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <User className="h-4 w-4 inline mr-1" />
            Select Doctor *
          </label>
          <select
            name="doctor"
            required
            value={formData.doctor}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Choose a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.last_name || doctor.first_name || doctor.username}
              </option>
            ))}
          </select>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Preferred Date *
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
              <Clock className="h-4 w-4 inline mr-1" />
              Preferred Time *
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

        {/* Appointment Type */}
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
            <option value="vaccination">Vaccination</option>
          </select>
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
            placeholder="Please describe your symptoms or reason for the appointment..."
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
            placeholder="Any additional information..."
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-blue-400 text-sm">
            <strong>Note:</strong> Your appointment request will be reviewed by
            the hospital staff. You will receive a confirmation once your
            appointment is approved.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/patient/appointments")}
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
            <span>{loading ? "Booking..." : "Book Appointment"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointment;
