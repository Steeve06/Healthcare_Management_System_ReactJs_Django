import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import DashboardLayout from "./DashboardLayout";
import {
  Calendar,
  FileText,
  Activity,
  User,
  Clock,
  Heart,
  Thermometer,
  Droplet,
  AlertCircle,
  Phone,
  Mail,
} from "lucide-react";
import api from "../../services/api";

const PatientDashboard = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patientProfile, setPatientProfile] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalAppointments: 0,
    upcomingCount: 0,
    completedCount: 0,
    medicalRecordsCount: 0,
  });

  // Hooks must be called before any conditional returns
  useEffect(() => {
    if (!children) {
      fetchPatientData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);

      // Fetch patient profile (linked to user account)
      const profileResponse = await api.get("/patients/", {
        params: { user: user.id },
      });
      const patientData =
        profileResponse.data.results?.[0] || profileResponse.data[0];

      if (!patientData) {
        console.log("No patient profile found");
        setLoading(false);
        return;
      }

      setPatientProfile(patientData);

      // Fetch patient's appointments
      const appointmentsResponse = await api.get(
        `/patients/${patientData.id}/appointments/`
      );
      const allAppointments = appointmentsResponse.data || [];

      // Filter upcoming appointments
      const today = new Date().toISOString().split("T")[0];
      const upcoming = allAppointments.filter(
        (apt) =>
          apt.appointment_date >= today &&
          (apt.status === "scheduled" || apt.status === "confirmed")
      );
      setUpcomingAppointments(upcoming.slice(0, 5));

      // Calculate stats
      const completed = allAppointments.filter(
        (apt) => apt.status === "completed"
      );

      // Fetch medical records
      const recordsResponse = await api.get(
        `/patients/${patientData.id}/medical_records/`
      );
      const records = recordsResponse.data || [];
      setRecentRecords(records.slice(0, 3));

      setDashboardStats({
        totalAppointments: allAppointments.length,
        upcomingCount: upcoming.length,
        completedCount: completed.length,
        medicalRecordsCount: records.length,
      });
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  // If children are passed, render them instead of default dashboard
  if (children) {
    return <DashboardLayout role="patient">{children}</DashboardLayout>;
  }

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
      completed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[status] || colors.scheduled;
  };

  if (loading) {
    return (
      <DashboardLayout role="patient">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Loading your dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!patientProfile) {
    return (
      <DashboardLayout role="patient">
        <div className="text-center py-12">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Profile Not Found
          </h3>
          <p className="text-gray-400 mb-4">
            Your patient profile hasn't been created yet. Please contact the
            hospital administration.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      icon: Calendar,
      label: "Total Appointments",
      value: dashboardStats.totalAppointments.toString(),
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
    },
    {
      icon: Clock,
      label: "Upcoming",
      value: dashboardStats.upcomingCount.toString(),
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
    },
    {
      icon: Activity,
      label: "Completed",
      value: dashboardStats.completedCount.toString(),
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
    },
    {
      icon: FileText,
      label: "Medical Records",
      value: dashboardStats.medicalRecordsCount.toString(),
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-500",
    },
  ];

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-800 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {patientProfile.first_name}!
          </h2>
          <p className="text-blue-100">
            {dashboardStats.upcomingCount > 0
              ? `You have ${dashboardStats.upcomingCount} upcoming appointment${
                  dashboardStats.upcomingCount > 1 ? "s" : ""
                }`
              : "No upcoming appointments"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all"
            >
              <div className={`p-3 ${stat.bgColor} rounded-lg w-fit mb-4`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Profile Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-500" />
              <span>My Profile</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {patientProfile.first_name?.[0]}
                  {patientProfile.last_name?.[0]}
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">
                    {patientProfile.full_name}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {patientProfile.patient_id}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Age</span>
                  <span className="text-white">{patientProfile.age} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Blood Group</span>
                  <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded font-semibold">
                    {patientProfile.blood_group}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700 space-y-2">
                <div className="flex items-center space-x-2 text-gray-300 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{patientProfile.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{patientProfile.email}</span>
                </div>
              </div>

              {/* Emergency Contact */}
              {patientProfile.emergency_contact_name && (
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-orange-400" />
                    <span className="text-gray-400 text-sm font-medium">
                      Emergency Contact
                    </span>
                  </div>
                  <p className="text-white text-sm">
                    {patientProfile.emergency_contact_name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {patientProfile.emergency_contact_phone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>Upcoming Appointments</span>
              </h3>
              <button
                onClick={() => navigate("/dashboard/patient/appointments")}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                View All
              </button>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming appointments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-500 font-semibold">
                          {appointment.appointment_time}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {new Date(
                              appointment.appointment_date
                            ).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-gray-400 text-sm capitalize">
                            {appointment.appointment_type.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Dr. {appointment.doctor_name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Medical Records */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span>Recent Medical Records</span>
            </h3>
            <button
              onClick={() => navigate("/dashboard/patient/records")}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All
            </button>
          </div>

          {recentRecords.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No medical records yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/dashboard/patient/records/${record.id}`)
                  }
                >
                  <p className="text-gray-400 text-xs mb-2">
                    {new Date(record.visit_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-white font-medium mb-2">
                    {record.diagnosis}
                  </p>
                  <p className="text-gray-400 text-sm mb-3">
                    {record.symptoms}
                  </p>

                  {/* Vitals if available */}
                  {(record.blood_pressure ||
                    record.temperature ||
                    record.heart_rate) && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-600">
                      {record.blood_pressure && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Activity className="h-3 w-3 text-red-400" />
                          <span className="text-gray-400">
                            {record.blood_pressure}
                          </span>
                        </div>
                      )}
                      {record.temperature && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Thermometer className="h-3 w-3 text-orange-400" />
                          <span className="text-gray-400">
                            {record.temperature}°F
                          </span>
                        </div>
                      )}
                      {record.heart_rate && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Heart className="h-3 w-3 text-pink-400" />
                          <span className="text-gray-400">
                            {record.heart_rate}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-gray-500 text-xs mt-2">
                    Dr. {record.doctor_name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Health Summary (if medical info available) */}
        {(patientProfile.allergies ||
          patientProfile.chronic_conditions ||
          patientProfile.current_medications) && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-500" />
              <span>Health Summary</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patientProfile.allergies && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 font-medium mb-2 text-sm">
                    Allergies
                  </p>
                  <p className="text-white text-sm">
                    {patientProfile.allergies}
                  </p>
                </div>
              )}
              {patientProfile.chronic_conditions && (
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <p className="text-orange-400 font-medium mb-2 text-sm">
                    Chronic Conditions
                  </p>
                  <p className="text-white text-sm">
                    {patientProfile.chronic_conditions}
                  </p>
                </div>
              )}
              {patientProfile.current_medications && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-400 font-medium mb-2 text-sm">
                    Current Medications
                  </p>
                  <p className="text-white text-sm">
                    {patientProfile.current_medications}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
