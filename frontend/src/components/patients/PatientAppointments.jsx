import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Calendar, Clock, User, MapPin, Phone } from "lucide-react";
import api from "../../services/api";

const PatientAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      // Get patient profile first
      const profileResponse = await api.get("/patients/", {
        params: { user: user.id },
      });
      const patientData =
        profileResponse.data.results?.[0] || profileResponse.data[0];

      if (!patientData) return;

      // Fetch appointments
      const response = await api.get(
        `/patients/${patientData.id}/appointments/`
      );
      let allAppointments = response.data || [];

      // Filter based on selection
      const today = new Date().toISOString().split("T")[0];

      if (filter === "upcoming") {
        allAppointments = allAppointments.filter(
          (apt) =>
            apt.appointment_date >= today &&
            (apt.status === "scheduled" || apt.status === "confirmed")
        );
      } else if (filter === "past") {
        allAppointments = allAppointments.filter(
          (apt) => apt.appointment_date < today || apt.status === "completed"
        );
      }

      setAppointments(allAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
      completed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[status] || colors.scheduled;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">My Appointments</h2>

        {/* Filter Tabs */}
        <div className="flex space-x-2 bg-gray-800 border border-gray-700 rounded-lg p-1">
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "upcoming"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "past"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Past
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            All
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">
          Loading appointments...
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400">No appointments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Date & Time */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2 text-blue-500">
                      <Calendar className="h-5 w-5" />
                      <span className="font-semibold">
                        {new Date(
                          appointment.appointment_date
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="h-5 w-5" />
                      <span>{appointment.appointment_time}</span>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="flex items-center space-x-2 mb-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-white font-medium">
                      Dr. {appointment.doctor_name}
                    </span>
                  </div>

                  {/* Appointment Type */}
                  <div className="mb-3">
                    <span className="text-gray-400 text-sm">Type: </span>
                    <span className="text-white capitalize">
                      {appointment.appointment_type.replace("_", " ")}
                    </span>
                  </div>

                  {/* Reason */}
                  {appointment.reason && (
                    <div className="text-gray-300 text-sm">
                      <span className="text-gray-400">Reason: </span>
                      {appointment.reason}
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
