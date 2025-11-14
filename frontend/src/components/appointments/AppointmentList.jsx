import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentService } from "../../services/appointmentService";
import Modal from "./Modal.jsx";
import AppointmentDetails from "./AppointmentDetails.jsx"; 
import {
  Calendar,
  Plus,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Filter,
  CalendarDays,
} from "lucide-react";

const AppointmentList = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let response;

      if (filterDate === "today") {
        response = await appointmentService.getTodayAppointments();
      } else if (filterDate === "upcoming") {
        response = await appointmentService.getUpcomingAppointments();
      } else {
        const params = filterStatus !== "all" ? { status: filterStatus } : {};
        response = await appointmentService.getAppointments(params);
      }

      setAppointments(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await appointmentService.confirmAppointment(id);
      fetchAppointments();
    } catch (error) {
      console.error("Error confirming appointment:", error);
      alert("Failed to confirm appointment");
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await appointmentService.cancelAppointment(id);
        fetchAppointments();
      } catch (error) {
        console.error("Error cancelling appointment:", error);
        alert("Failed to cancel appointment");
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: {
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/20",
        label: "Scheduled",
      },
      confirmed: {
        bg: "bg-green-500/10",
        text: "text-green-400",
        border: "border-green-500/20",
        label: "Confirmed",
      },
      in_progress: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        border: "border-yellow-500/20",
        label: "In Progress",
      },
      completed: {
        bg: "bg-gray-500/10",
        text: "text-gray-400",
        border: "border-gray-500/20",
        label: "Completed",
      },
      cancelled: {
        bg: "bg-red-500/10",
        text: "text-red-400",
        border: "border-red-500/20",
        label: "Cancelled",
      },
      no_show: {
        bg: "bg-orange-500/10",
        text: "text-orange-400",
        border: "border-orange-500/20",
        label: "No Show",
      },
    };

    const config = statusConfig[status] || statusConfig.scheduled;

    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text} border ${config.border}`}
      >
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      consultation: {
        bg: "bg-purple-500/10",
        text: "text-purple-400",
        label: "Consultation",
      },
      follow_up: {
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        label: "Follow-up",
      },
      check_up: {
        bg: "bg-green-500/10",
        text: "text-green-400",
        label: "Check-up",
      },
      emergency: {
        bg: "bg-red-500/10",
        text: "text-red-400",
        label: "Emergency",
      },
      vaccination: {
        bg: "bg-cyan-500/10",
        text: "text-cyan-400",
        label: "Vaccination",
      },
      lab_test: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        label: "Lab Test",
      },
    };

    const config = typeConfig[type] || typeConfig.consultation;

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Calendar View Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Appointments</h2>
        <div className="flex items-center space-x-3">
          {/* Calendar View Button */}
          <button
            onClick={() => navigate("/dashboard/doctor/appointments/calendar")}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <CalendarDays className="h-5 w-5" />
            <span>Calendar View</span>
          </button>

          {/* Schedule Appointment Button */}
          <button
            onClick={() => navigate("/dashboard/doctor/appointments/new")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Schedule Appointment</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <span className="text-gray-400 font-medium">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date Filter
            </label>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status Filter
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No appointments found
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-6 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Appointment Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-blue-400 font-semibold text-lg">
                        {appointment.appointment_id}
                      </span>
                      {getStatusBadge(appointment.status)}
                      {getTypeBadge(appointment.appointment_type)}
                    </div>

                    {/* Patient Info */}
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-white font-medium">
                        {appointment.patient_name}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">
                        {appointment.patient_phone}
                      </span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {new Date(
                            appointment.appointment_date
                          ).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{appointment.appointment_time}</span>
                      </div>
                    </div>

                    {/* Doctor */}
                    <div className="mt-2 text-sm text-gray-400">
                      Doctor:{" "}
                      <span className="text-gray-300">
                        {appointment.doctor_name}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    {appointment.status === "scheduled" && (
                      <button
                        onClick={() => handleConfirm(appointment.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                        title="Confirm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Confirm</span>
                      </button>
                    )}
                    {(appointment.status === "scheduled" ||
                      appointment.status === "confirmed") && (
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                        title="Cancel"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedId(appointment.id)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
      >
        {selectedId && <AppointmentDetails appointmentId={selectedId} />}
      </Modal>
    </div>
  );
};

export default AppointmentList;
